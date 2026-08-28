import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ isOpen }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Safely check for admin status
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setErrorMsg("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-medium transition-all duration-300 ease-in-out ${isOpen ? "pl-64" : "pl-0 md:pl-16"}`}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="animate-pulse">Loading system metrics...</span>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className={`min-h-screen bg-slate-950 p-6 transition-all duration-300 ease-in-out ${isOpen ? "pl-64" : "pl-0 md:pl-16"}`}>
        <div className="max-w-7xl mx-auto mt-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-400 text-sm animate-bounce">
          {errorMsg}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 ease-in-out ${
      isOpen ? "pl-64" : "pl-0 md:pl-16"
    }`}>
      {/* Dynamic inline styles for premium stagger animations if not present in tailwind.config */}
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
        <header className="space-y-2 border-b border-slate-800/60 pb-6 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-slate-400 flex flex-wrap items-center gap-2">
            You're logged in as <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">{user?.role}</span>
            {user?.role === "teacher" && user?.assignedClasses?.length > 0 && (
              <span className="text-slate-500">
                for class(es): <span className="text-indigo-400 font-medium">{user.assignedClasses.join(", ")}</span>
              </span>
            )}
          </p>
        </header>

        {/* Dynamic Financial Ledger Tracker (Compulsory Admin Module + Expenses Card) */}
        {isAdmin && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
            
            <div className="sm:border-r border-slate-800/60 pr-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Projected Term Revenue</span>
              <div className="text-2xl font-bold text-white mt-1">${data?.finance?.projected || "0.00"}</div>
            </div>

            <div className="lg:border-r border-slate-800/60 pr-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Collected Fees</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">${data?.finance?.collected || "0.00"}</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${data?.finance?.collectionRate || 0}%` }}></div>
              </div>
            </div>

            {/* Added Operational Expenses Tracking Sub-Card */}
            <div className="sm:border-r border-slate-800/60 pr-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Monthly Expenses</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">${data?.finance?.expenses || "0.00"}</div>
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">Payroll, Utilities & Maintenance</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Outstanding Defaulters</span>
              <div className="text-2xl font-bold text-amber-500 mt-1">{data?.finance?.defaultersCount || 0} Students</div>
              <span className="text-xs text-indigo-400 underline cursor-pointer hover:text-indigo-300 block mt-1 transition-colors">Manage Ledger &rarr;</span>
            </div>
          </div>
        )}

        {/* Stats Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm group hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full group-hover:bg-indigo-500/10 transition-all duration-500 group-hover:scale-120"></div>
            <div className="text-3xl font-extrabold text-white tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{data?.totalStudents}</div>
            <div className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-wider">
              {user?.role === "parent" ? "Your children" : "Total Active Students"}
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm group hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full group-hover:bg-amber-500/10 transition-all duration-500 group-hover:scale-120"></div>
            <div className="text-3xl font-extrabold text-amber-400 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{data?.lowAttendanceAlerts?.length}</div>
            <div className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-wider">Low attendance alerts</div>
          </div>

          <div className="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm group hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-500 group-hover:scale-120"></div>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{data?.upcomingEvents?.length}</div>
            <div className="text-xs font-medium text-slate-400 mt-2 uppercase tracking-wider">Upcoming events</div>
          </div>
        </div>

        {/* Academic Structure & RBAC Sections (Compulsory Admin Split-View) */}
        {isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            
            {/* Academic Configuration Table */}
            <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4 hover:border-slate-800 group transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">Academic Framework</h3>
                  <p className="text-xs text-slate-400">Current running classes and sections.</p>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700/60 active:scale-95 transition-all">
                  + Add Class
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800/80">
                    <tr>
                      <th className="p-3">Class</th>
                      <th className="p-3">Sections</th>
                      <th className="p-3">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {data?.academicClasses?.map((cls, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors group/row">
                        <td className="p-3 font-medium text-white group-hover/row:text-indigo-400 transition-colors">{cls.name}</td>
                        <td className="p-3 flex gap-1">
                          {cls.sections?.map((sec) => (
                            <span key={sec} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700/40 hover:bg-slate-700 transition-colors">{sec}</span>
                          ))}
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-xs">{cls.strength} students</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="3" className="p-3 text-xs text-slate-500 italic text-center">No academic structures populated.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick RBAC User Control Panel */}
            <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4 hover:border-slate-800 group transition-all duration-300">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">Identity & Access Logs</h3>
                <p className="text-xs text-slate-400">System provisioning actions and security flags.</p>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {data?.recentRegistrations?.map((reg) => (
                  <div key={reg.id} className="p-3 bg-slate-900/30 border border-slate-800/60 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700/60 transition-all duration-200">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{reg.name}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700/60 uppercase font-mono tracking-wider">{reg.role}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 active:scale-95 transition-all">Reset</button>
                      <button className="px-2.5 py-1 text-[11px] bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 active:scale-95 transition-all">Block</button>
                    </div>
                  </div>
                )) || <p className="text-xs text-slate-500 italic text-center py-4">No recent user registration events.</p>}
              </div>
            </section>
          </div>
        )}

        {/* Dynamic Low Attendance Alerts */}
        {data?.lowAttendanceAlerts?.length > 0 && (
          <section className="space-y-4 bg-red-950/10 border border-red-900/30 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
            <h2 className="text-lg font-semibold text-red-400 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Low Attendance Alerts
            </h2>
            <ul className="divide-y divide-red-900/20">
              {data.lowAttendanceAlerts.map((a) => (
                <li key={a.studentId} className="py-3 first:pt-0 last:pb-0 flex flex-wrap justify-between items-center text-sm gap-2 hover:bg-red-950/20 px-2 rounded-lg transition-colors duration-150">
                  <span className="text-slate-300">
                    <strong className="text-white font-medium">{a.name}</strong> <span className="text-slate-500 text-xs">({a.rollNumber})</span>
                  </span>
                  <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-semibold">
                    {a.attendancePercentage}% attendance
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Upcoming Events Section */}
        <section className="space-y-4 bg-slate-900/20 border border-slate-800/60 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <h2 className="text-xl font-semibold text-white tracking-tight">Upcoming Events</h2>
          {data?.upcomingEvents?.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No upcoming events scheduled.</p>
          ) : (
            <ul className="divide-y divide-slate-800/60">
              {data.upcomingEvents.map((ev) => (
                <li key={ev._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-slate-900/40 px-2 rounded-xl transition-all duration-150">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                      ev.type === 'exam' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      ev.type === 'holiday' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {ev.type}
                    </span>
                    <strong className="text-sm font-medium text-slate-200 truncate">{ev.title}</strong>
                  </div>
                  <span className="text-xs text-slate-500 font-mono shrink-0">
                    {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </div>
  );
}