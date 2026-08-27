import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = { subject: "", examType: "quiz", marks: "", maxMarks: 100, term: "" };

export default function Grades() {
  const { user } = useAuth();
  const canRecord = user.role === "admin" || user.role === "teacher";

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [grades, setGrades] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (canRecord) {
      api.get("/students").then((res) => {
        setStudents(res.data.students);
        if (res.data.students.length > 0) setSelectedStudent(res.data.students[0]._id);
      });
    } else if (user.children?.length > 0) {
      setSelectedStudent(user.children[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    api.get(`/grades/student/${selectedStudent}`).then((res) => {
      setGrades(res.data.grades);
      setSummary(res.data.summary);
    });
  }, [selectedStudent]);

  async function handleAddGrade(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/grades", { ...form, student: selectedStudent });
      setForm(emptyForm);
      const res = await api.get(`/grades/student/${selectedStudent}`);
      setGrades(res.data.grades);
      setSummary(res.data.summary);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not add grade.");
    }
  }

  return (
    <div className="page">
      <h1>{canRecord ? "Grades" : "My Child's Grades"}</h1>

      {canRecord && (
        <label className="student-picker">
          Student
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.rollNumber})
              </option>
            ))}
          </select>
        </label>
      )}

      {summary && (
        <div className="card-grid">
          <div className="stat-card">
            <div className="stat-number">{summary.count}</div>
            <div className="stat-label">Recorded grades</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{summary.avgPercentage ?? "\u2014"}%</div>
            <div className="stat-label">Average</div>
          </div>
        </div>
      )}

      {message && <div className="alert-error">{message}</div>}

      {canRecord && (
        <form className="inline-form" onSubmit={handleAddGrade}>
          <div className="form-grid">
            <label>
              Subject
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </label>
            <label>
              Exam Type
              <select
                value={form.examType}
                onChange={(e) => setForm({ ...form, examType: e.target.value })}
              >
                <option value="quiz">Quiz</option>
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
              </select>
            </label>
            <label>
              Marks
              <input
                type="number"
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: e.target.value })}
                required
              />
            </label>
            <label>
              Max Marks
              <input
                type="number"
                value={form.maxMarks}
                onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                required
              />
            </label>
            <label>
              Term
              <input
                value={form.term}
                onChange={(e) => setForm({ ...form, term: e.target.value })}
                placeholder="e.g. 2026-T1"
                required
              />
            </label>
          </div>
          <button type="submit">Add grade</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Exam</th>
            <th>Marks</th>
            <th>Percentage</th>
            <th>Term</th>
          </tr>
        </thead>
        <tbody>
          {grades.length === 0 && (
            <tr>
              <td colSpan={5} className="muted">
                No grades recorded yet.
              </td>
            </tr>
          )}
          {grades.map((g) => (
            <tr key={g._id}>
              <td>{g.subject}</td>
              <td>{g.examType}</td>
              <td>
                {g.marks} / {g.maxMarks}
              </td>
              <td>{g.percentage}%</td>
              <td>{g.term}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
