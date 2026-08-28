import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = { subject: "", examType: "quiz", marks: "", maxMarks: 100, term: "" };

export default function Grades({ isOpen }) {
  const { user } = useAuth();
  const canRecord = user?.role === "admin" || user?.role === "teacher";

  const [className, setClassName] = useState(user?.assignedClasses?.[0] || "");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [grades, setGrades] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Effect 1: Fetch student roster automatically whenever the selected Class target updates
  useEffect(() => {
    if (!canRecord || !className) return;
    
    setLoadingStudents(true);
    setMessage("");
    setStudents([]);
    setSelectedStudent("");
    setGrades([]);
    setSummary(null);

    api
      .get("/students", { params: { class: className } })
      .then((res) => {
        const studentList = res.data.students || res.data;
        setStudents(studentList);
        if (studentList.length > 0) {
          setSelectedStudent(studentList[0]._id);
        } else {
          setMessage(`No active student registers found mapped to class ${className}.`);
        }
      })
      .catch(() => setMessage("Failed to pull student records for this class location."))
      .finally(() => setLoadingStudents(false));
  }, [className, canRecord]);

  // Effect 2: Run parent initial bootstrap logic if role is not management
  useEffect(() => {
    if (!canRecord && user?.children?.length > 0) {
      setSelectedStudent(user.children[0]);
    }
  }, [canRecord, user]);

  // Effect 3: Load existing grades matrix whenever target student profile changes
  useEffect(() => {
    if (!selectedStudent) return;
    api
      .get(`/grades/student/${selectedStudent}`)
      .then((res) => {
        setGrades(res.data.grades || []);
        setSummary(res.data.summary || null);
      })
      .catch(() => {
        setGrades([]);
        setSummary(null);
      });
  }, [selectedStudent]);

  async function handleAddGrade(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/grades", { ...form, student: selectedStudent });
      setForm(emptyForm);
      const res = await api.get(`/grades/student/${selectedStudent}`);
      setGrades(res.data.grades || []);
      setSummary(res.data.summary || null);
      setMessage("Performance record committed successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not append evaluation metrics.");
    }
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 ease-in-out ${
      isOpen ? "pl-64" : "pl-0 md:pl-16"
    }`}>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Page Header Block */}
        <header className="space-y-2 border-b border-slate-800/60 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {canRecord ? "Academic Grading Matrix" : "Performance Logs"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {canRecord ? "Filter by roster classifications, select matching pupils, and submit evaluation blocks." : "Review real-time child course metrics, exam cycles, and relative weight metrics."}
            </p>
          </div>
        </header>

        {/* Dynamic Class & Student Filtering Context Console */}
        {canRecord && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class Filter Configuration</label>
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. 10-B"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Student Profile</label>
              <select 
                value={selectedStudent} 
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={loadingStudents || students.length === 0}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingStudents ? (
                  <option className="bg-slate-950">Querying targeted roster...</option>
                ) : students.length === 0 ? (
                  <option className="bg-slate-950">No students available for selection</option>
                ) : (
                  students.map((s) => (
                    <option key={s._id} value={s._id} className="bg-slate-950">
                      {s.name} ({s.rollNumber || "No Roll"})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        )}

        {/* Real-time Dynamic Session Summary Analytics Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Evaluation Entries</span>
              <div className="text-2xl font-bold text-white mt-1">{summary.count} Records Logged</div>
            </div>
            
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 backdrop-blur-sm relative overflow-hidden">
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Cumulative Average Score</span>
              <div className="text-2xl font-bold text-indigo-400 mt-1">
                {summary.avgPercentage !== undefined && summary.avgPercentage !== null ? `${summary.avgPercentage}%` : "—"}
              </div>
            </div>
          </div>
        )}

        {/* Global Error/Notification Message System */}
        {message && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 text-sm flex items-center justify-between animate-fade-in-up">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-500 hover:text-slate-400 font-bold">&times;</button>
          </div>
        )}

        {/* Grade Entry Form Interface Panel */}
        {canRecord && selectedStudent && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "180ms" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-5">Record New Performance Delta</h3>
            <form onSubmit={handleAddGrade} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Exam Type</label>
                  <select
                    value={form.examType}
                    onChange={(e) => setForm({ ...form, examType: e.target.value })}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Score Obtained</label>
                  <input
                    type="number"
                    value={form.marks}
                    onChange={(e) => setForm({ ...form, marks: e.target.value })}
                    placeholder="85"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Max Points</label>
                  <input
                    type="number"
                    value={form.maxMarks}
                    onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                    placeholder="100"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Term Anchor</label>
                  <input
                    value={form.term}
                    onChange={(e) => setForm({ ...form, term: e.target.value })}
                    placeholder="e.g. 2026-T1"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 shadow-lg shadow-indigo-600/10 rounded-xl transition-all active:scale-95"
                >
                  Commit Entry Block
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Performance Logs Matrix Table Panel */}
        <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "220ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800/80">
                <tr>
                  <th className="p-4 font-semibold tracking-wider">Subject Field</th>
                  <th className="p-4 font-semibold tracking-wider">Evaluation Tier</th>
                  <th className="p-4 font-semibold tracking-wider">Absolute Marks</th>
                  <th className="p-4 font-semibold tracking-wider">Relative Score Percentage</th>
                  <th className="p-4 font-semibold tracking-wider">Term Cycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {grades.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-slate-500 italic">
                      No matching performance logs currently mapped to this student profile configuration.
                    </td>
                  </tr>
                )}
                {grades.map((g) => (
                  <tr key={g._id} className="hover:bg-slate-900/30 group transition-colors duration-150">
                    <td className="p-4 font-medium text-white group-hover:text-indigo-400 transition-colors">
                      {g.subject}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs rounded font-medium border ${
                        g.examType === 'final' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                        g.examType === 'midterm' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        'bg-slate-800/80 border-slate-700/40 text-slate-400'
                      }`}>
                        {g.examType}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-300">
                      {g.marks} <span className="text-slate-600">/</span> {g.maxMarks}
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {g.percentage}%
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-400">{g.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}