import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// Pass isOpen from your main layout layer to synchronize layout shifts
export default function Attendance({ isOpen }) {
  const { user } = useAuth();
  const [className, setClassName] = useState(user?.assignedClasses?.[0] || "");
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
      .then((res) => setStudents(res.data.students || res.data))
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
    <div className={`min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 ease-in-out ${
      isOpen ? "pl-64" : "pl-0 md:pl-16"
    }`}>
      
      {/* Dynamic inline styles for premium stagger animations */}
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
        
        {/* Header Section */}
        <header className="space-y-2 border-b border-slate-800/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Attendance Registry
            </h1>
            <p className="text-sm text-slate-400 mt-1">Take daily roll call records and log tracking states for assigned classes.</p>
          </div>

          <button 
            onClick={handleSaveAll}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 shadow-lg shadow-indigo-600/10 rounded-xl transition-all active:scale-95 shrink-0 self-end sm:self-auto"
          >
            Save Attendance Session
          </button>
        </header>

        {/* Dynamic Context Parameters Bar */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 gap-6 relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Class Target Configuration
            </label>
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. 10-B"
              className="w-full max-w-sm bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Registry Logging Date
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="w-full max-w-sm bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Feedback Alert Matrix */}
        {message && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 text-sm flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-500 hover:text-slate-400 font-bold">&times;</button>
          </div>
        )}

        {/* Data Load Interface Handler */}
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-500 gap-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Querying class rosters...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="bg-slate-900/10 border border-slate-800/40 rounded-2xl p-12 text-center text-sm text-slate-500 italic animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            No dynamic pupil assets found matching specified filter configuration parameters.
          </div>
        ) : (
          <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800/80">
                  <tr>
                    <th className="p-4 font-semibold tracking-wider">Student Name</th>
                    <th className="p-4 font-semibold tracking-wider">Roll No.</th>
                    <th className="p-4 font-semibold tracking-wider text-center w-24">Present</th>
                    <th className="p-4 font-semibold tracking-wider text-center w-24">Absent</th>
                    <th className="p-4 font-semibold tracking-wider text-center w-24">Late</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-900/30 group transition-colors duration-150">
                      <td className="p-4 font-medium text-white group-hover:text-indigo-400 transition-colors">
                        {s.name}
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-400">{s.rollNumber}</td>
                      
                      {/* State Option Selector Group */}
                      {["present", "absent", "late"].map((opt) => {
                        const isChecked = statusMap[s._id] === opt;
                        const dynamicRadioColor = 
                          opt === "present" ? "checked:bg-emerald-500 checked:border-emerald-400" :
                          opt === "absent" ? "checked:bg-rose-500 checked:border-rose-400" :
                          "checked:bg-amber-500 checked:border-amber-400";

                        return (
                          <td key={opt} className="p-4 text-center">
                            <input
                              type="radio"
                              name={`status-${s._id}`}
                              checked={isChecked}
                              onChange={() => setStatus(s._id, opt)}
                              className={`w-4 h-4 rounded-full bg-slate-950 border border-slate-800 focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none transition-all ${dynamicRadioColor} checked:scale-110 checked:ring-2 checked:ring-slate-950`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}