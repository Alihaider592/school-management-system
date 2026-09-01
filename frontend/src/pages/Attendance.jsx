import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Attendance({ isOpen }) {
  const { user } = useAuth();
  const [className, setClassName] = useState(user?.assignedClasses?.[0] || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [hasExistingLogs, setHasExistingLogs] = useState(false);

  // Effect 1: Pull students roster when class target changes
  useEffect(() => {
    if (!className) return;
    setLoading(true);
    setStudents([]);
    setStatusMap({});

    api
      .get("/students", { params: { class: className } })
      .then((res) => {
        const studentData = res.data.students || res.data;
        setStudents(studentData);
      })
      .catch(() => setMessage("Could not load students for this class."))
      .finally(() => setLoading(false));
  }, [className]);

  // Effect 2: Pull existing logs when the date or class selections update.
  // If no logs exist yet for this date, default everyone to "present" —
  // the common case — so the admin/teacher only has to touch the exceptions.
  useEffect(() => {
    if (!className || !date || students.length === 0) return;

    api
      .get(`/attendance/class/${encodeURIComponent(className)}`, { params: { date } })
      .then((res) => {
        const existingRecords = res.data.records || res.data.attendance || res.data;
        if (existingRecords && existingRecords.length > 0) {
          const map = {};
          existingRecords.forEach((record) => {
            // Adjust depending on if your API populates student as an object or raw ID string
            const sId = record.student?._id || record.student;
            if (sId) map[sId] = record.status;
          });
          // Any student in the roster not covered by a saved record
          // (e.g. newly enrolled) still defaults to present.
          students.forEach((s) => {
            if (!map[s._id]) map[s._id] = "present";
          });
          setStatusMap(map);
          setHasExistingLogs(true);
          setMessage(`Loaded existing attendance for ${date}.`);
        } else {
          const defaultMap = {};
          students.forEach((s) => {
            defaultMap[s._id] = "present";
          });
          setStatusMap(defaultMap);
          setHasExistingLogs(false);
          setMessage(`No existing logs for ${date} — everyone marked present by default. Adjust as needed.`);
        }
      })
      .catch(() => {
        // If endpoint isn't fully set up yet, fall back to default-present
        // rather than leaving the whole roster blank.
        const defaultMap = {};
        students.forEach((s) => {
          defaultMap[s._id] = "present";
        });
        setStatusMap(defaultMap);
        setHasExistingLogs(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, className, students]);

  function setStatus(studentId, status) {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  }

  function markAll(status) {
    const map = {};
    students.forEach((s) => {
      map[s._id] = status;
    });
    setStatusMap(map);
  }

  async function handleSaveAll() {
    setMessage("");
    const entries = Object.entries(statusMap);
    if (entries.length === 0) {
      setMessage("Mark at least one student before saving.");
      return;
    }
    setSaving(true);
    try {
      await Promise.all(
        entries.map(([studentId, status]) =>
          api.post("/attendance", { student: studentId, date, status })
        )
      );
      setHasExistingLogs(true);
      setMessage(`Saved attendance for ${entries.length} student(s) on ${date}.`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save attendance.");
    } finally {
      setSaving(false);
    }
  }

  const presentCount = Object.values(statusMap).filter((s) => s === "present").length;
  const absentCount = Object.values(statusMap).filter((s) => s === "absent").length;
  const lateCount = Object.values(statusMap).filter((s) => s === "late").length;

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

        <header className="space-y-2 border-b border-slate-800/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Attendance Registry
            </h1>
            <p className="text-sm text-slate-400 mt-1">Take daily roll call records and log tracking states for assigned classes.</p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={saving || students.length === 0}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 shadow-lg shadow-indigo-600/10 rounded-xl transition-all active:scale-95 shrink-0 self-end sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : hasExistingLogs ? "Update Attendance" : "Save Attendance Session"}
          </button>
        </header>

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

        {message && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 text-sm flex items-center justify-between animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-500 hover:text-slate-400 font-bold">&times;</button>
          </div>
        )}

        {!loading && students.length > 0 && (
          <>
            {/* Bulk mark-all shortcuts */}
            <div className="flex flex-wrap items-center gap-2 animate-fade-in-up" style={{ animationDelay: "170ms" }}>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mr-1">Quick Mark:</span>
              <button
                onClick={() => markAll("present")}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAll("absent")}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
              >
                Mark All Absent
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "180ms" }}>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Class Strength</span>
                <div className="text-xl font-bold text-white mt-0.5">{students.length} Students</div>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Present Summary</span>
                <div className="text-xl font-bold text-emerald-400 mt-0.5">{presentCount} <span className="text-xs text-slate-500 font-normal">/ {students.length}</span></div>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
                <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">Absent Summary</span>
                <div className="text-xl font-bold text-rose-400 mt-0.5">{absentCount} <span className="text-xs text-slate-500 font-normal">/ {students.length}</span></div>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 backdrop-blur-sm">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Late Summary</span>
                <div className="text-xl font-bold text-amber-400 mt-0.5">{lateCount} <span className="text-xs text-slate-500 font-normal">unexcused</span></div>
              </div>
            </div>
          </>
        )}

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