import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Attendance() {
  const { user } = useAuth();
  const [className, setClassName] = useState(user.assignedClasses?.[0] || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!className) return;
    setLoading(true);
    api
      .get("/students", { params: { class: className } })
      .then((res) => setStudents(res.data.students))
      .catch(() => setMessage("Could not load students for this class."))
      .finally(() => setLoading(false));
  }, [className]);

  function setStatus(studentId, status) {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  }

  async function handleSaveAll() {
    setMessage("");
    try {
      const entries = Object.entries(statusMap);
      if (entries.length === 0) {
        setMessage("Mark at least one student before saving.");
        return;
      }
      await Promise.all(
        entries.map(([studentId, status]) =>
          api.post("/attendance", { student: studentId, date, status })
        )
      );
      setMessage(`Saved attendance for ${entries.length} student(s).`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save attendance.");
    }
  }

  return (
    <div className="page">
      <h1>Mark Attendance</h1>

      <div className="filter-bar">
        <label>
          Class
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g. 10-B"
          />
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      {message && <div className="alert-info">{message}</div>}

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p className="muted">No students found for this class.</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.rollNumber}</td>
                  {["present", "absent", "late"].map((opt) => (
                    <td key={opt} className="radio-cell">
                      <input
                        type="radio"
                        name={`status-${s._id}`}
                        checked={statusMap[s._id] === opt}
                        onChange={() => setStatus(s._id, opt)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveAll}>Save attendance</button>
        </>
      )}
    </div>
  );
}
