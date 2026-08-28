import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  type: "meeting",
  targetAudience: "students", // 'students' or 'teachers'
  studentScope: "all",        // 'all' or 'specific'
  classApplicable: "all",     // 'all' or specific class like '10-B'
};

export default function Events({ isOpen }) {
  const { user } = useAuth();
  const canCreate = user?.role === "admin" || user?.role === "teacher";

  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  function loadEvents() {
    api.get("/events").then((res) => setEvents(res.data.events || res.data || []));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle dynamic scope resets when changing target audience
  function handleAudienceChange(e) {
    const value = e.target.value;
    if (value === "teachers") {
      setForm({ ...form, targetAudience: "teachers", classApplicable: "teachers" });
    } else {
      setForm({ ...form, targetAudience: "students", studentScope: "all", classApplicable: "all" });
    }
  }

  function handleScopeChange(e) {
    const scope = e.target.value;
    setForm({
      ...form,
      studentScope: scope,
      classApplicable: scope === "all" ? "all" : "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (form.targetAudience === "students" && form.studentScope === "specific" && !form.classApplicable.trim()) {
      setMessage("Please enter a specific class name.");
      return;
    }

    try {
      await api.post("/events", form);
      setForm(emptyForm);
      setShowForm(false);
      loadEvents();
      setMessage("Event published successfully to targeted dashboard channels.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create event entry.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete event.");
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

      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Header Block */}
        <header className="space-y-2 border-b border-slate-800/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Institutional Timeline
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Dispatch notifications and schedule events for faculty or specific student cohorts.
            </p>
          </div>

          {canCreate && (
            <button 
              onClick={() => setShowForm((v) => !v)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all active:scale-95 border shrink-0 ${
                showForm 
                  ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800" 
                  : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-600/10"
              }`}
            >
              {showForm ? "Collapse Workspace" : "+ Schedule New Event"}
            </button>
          )}
        </header>

        {/* Global Notifications */}
        {message && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 text-sm flex items-center justify-between animate-fade-in-up">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-500 hover:text-slate-400 font-bold">&times;</button>
          </div>
        )}

        {/* Dynamic Creation Form */}
        {showForm && canCreate && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "50ms" }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-5">Target Event Audience & Dispatch</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Event Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Staff Briefing / Science Fair"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Calendar Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all [color-scheme:dark]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Event Category</label>
                  <select 
                    value={form.type} 
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value="exam">Exam Event</option>
                    <option value="holiday">Holiday / Recess</option>
                    <option value="meeting">General Meeting</option>
                    <option value="deadline">Milestone / Deadline</option>
                  </select>
                </div>

                {/* Target Audience Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">Target Audience</label>
                  <select
                    value={form.targetAudience}
                    onChange={handleAudienceChange}
                    className="bg-slate-950/60 border border-indigo-500/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer font-medium"
                  >
                    <option value="students">Students</option>
                    <option value="teachers">Teachers Only</option>
                  </select>
                </div>

                {/* Conditional Scope Selector for Students */}
                {form.targetAudience === "students" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Student Target Scope</label>
                    <select
                      value={form.studentScope}
                      onChange={handleScopeChange}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="all">All Students (Entire School)</option>
                      <option value="specific">Specific Class Target</option>
                    </select>
                  </div>
                )}

                {/* Conditional Specific Class Input */}
                {form.targetAudience === "students" && form.studentScope === "specific" && (
                  <div className="flex flex-col gap-1.5 animate-fade-in-up">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Class Name</label>
                    <input
                      value={form.classApplicable === "all" ? "" : form.classApplicable}
                      onChange={(e) => setForm({ ...form, classApplicable: e.target.value })}
                      placeholder="e.g. 10-B"
                      required
                      className="bg-slate-950/60 border border-indigo-500/60 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                )}

              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Event Details & Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide additional details or instructions..."
                  rows={2}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 shadow-lg shadow-indigo-600/10 rounded-xl transition-all active:scale-95"
                >
                  Publish & Send Notifications
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Timeline Registry Display */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          {events.length === 0 ? (
            <div className="bg-slate-900/10 border border-slate-800/40 rounded-2xl p-16 text-center text-sm text-slate-500 italic">
              No events recorded in the timeline.
            </div>
          ) : (
            <ul className="space-y-3">
              {events.map((ev, index) => {
                const badgeColor = 
                  ev.type === "exam" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                  ev.type === "holiday" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  ev.type === "deadline" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                  "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";

                const isForTeachers = ev.targetAudience === "teachers" || ev.classApplicable === "teachers";

                return (
                  <li 
                    key={ev._id} 
                    className="bg-slate-900/20 border border-slate-800/60 hover:border-slate-700/60 p-5 rounded-2xl backdrop-blur-sm flex items-start justify-between gap-6 transition-all duration-200 group animate-fade-in-up"
                    style={{ animationDelay: `${120 + index * 30}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-lg h-fit select-none shrink-0 text-center ${badgeColor}`}>
                        {ev.type}
                      </span>

                      <div className="space-y-1">
                        <h4 className="font-semibold text-white text-base group-hover:text-indigo-400 transition-colors">
                          {ev.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-500">
                          <span className="text-slate-400">{new Date(ev.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                          <span>&middot;</span>
                          <span className={`px-2 py-0.5 rounded border text-[11px] ${
                            isForTeachers 
                              ? "bg-purple-950/40 border-purple-800/50 text-purple-300" 
                              : "bg-slate-950 border-slate-800/40 text-slate-300"
                          }`}>
                            Target: {isForTeachers ? "Teachers Only" : ev.classApplicable === "all" ? "All Students" : `Class ${ev.classApplicable}`}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-sm text-slate-400 leading-relaxed pt-2 font-normal max-w-2xl">
                            {ev.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {user?.role === "admin" && (
                      <button 
                        onClick={() => handleDelete(ev._id)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-[11px] font-semibold text-rose-400 bg-rose-950/20 hover:bg-rose-950/50 border border-rose-900/30 rounded-lg transition-all active:scale-95 shrink-0"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}