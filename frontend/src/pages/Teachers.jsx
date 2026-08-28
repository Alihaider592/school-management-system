import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { name: "", email: "", primarySubject: "", assignedClasses: "" };

export default function Teachers({ isOpen }) {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  function loadTeachers() {
    api.get("/teachers")
      .then((res) => setTeachers(res.data.teachers || res.data || []))
      .catch(() => setMessage("Failed to retrieve faculty records."));
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    
    // Format classes text into an array of trimmed tags
    const processedForm = {
      ...form,
      assignedClasses: form.assignedClasses.split(",").map(c => c.trim()).filter(Boolean)
    };

    try {
      await api.post("/teachers", processedForm);
      setForm(emptyForm);
      setShowForm(false);
      loadTeachers();
      setMessage("Faculty profile successfully synchronized into system directories.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not provision new teacher account.");
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

      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        
        <header className="space-y-2 border-b border-slate-800/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Faculty Registry
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Provision workspace credentials, track system mappings, and update assigned class nodes.
            </p>
          </div>
          <button 
            onClick={() => setShowForm((v) => !v)}
            className={`px-5 py-2.5 text-xs font-semibold rounded-xl transition-all active:scale-95 border shrink-0 ${
              showForm 
                ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800" 
                : "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-600/10"
            }`}
          >
            {showForm ? "Close Form" : "+ Onboard Faculty"}
          </button>
        </header>

        {message && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 text-sm flex items-center justify-between animate-fade-in-up">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-slate-500 hover:text-slate-400 font-bold">&times;</button>
          </div>
        )}

        {showForm && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm animate-fade-in-up">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-5">Create Teacher System Node</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Dr. Sarah Jenkins"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jenkins@institution.edu"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Primary Subject Field</label>
                  <input
                    value={form.primarySubject}
                    onChange={(e) => setForm({ ...form, primarySubject: e.target.value })}
                    placeholder="Organic Chemistry"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Class Assignments (Comma-separated)</label>
                  <input
                    value={form.assignedClasses}
                    onChange={(e) => setForm({ ...form, assignedClasses: e.target.value })}
                    placeholder="10-A, 11-B, 12-C"
                    required
                    className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 border border-cyan-500 shadow-lg rounded-xl transition-all active:scale-95">
                  Authorize & Commit Account
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
          {teachers.length === 0 ? (
            <div className="col-span-full bg-slate-900/10 border border-slate-800/40 rounded-2xl p-16 text-center text-sm text-slate-500 italic">
              No authenticated faculty members currently registered in this workspace environment.
            </div>
          ) : (
            teachers.map((t) => (
              <div key={t._id} className="bg-slate-900/20 border border-slate-800/60 p-5 rounded-2xl backdrop-blur-sm flex flex-col justify-between gap-4 hover:border-slate-700 transition-all group">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-cyan-950/40 text-cyan-400 border border-cyan-900/30 font-bold rounded-xl flex items-center justify-center text-sm">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">{t.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{t.email}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Specialty Matrix</span>
                    <span className="text-xs text-slate-300 font-medium">{t.primarySubject}</span>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Assigned Classes Scope</span>
                  <div className="flex flex-wrap gap-1">
                    {t.assignedClasses?.map((cls, idx) => (
                      <span key={idx} className="bg-slate-950 px-2 py-0.5 border border-slate-800/80 rounded text-[10px] font-mono font-medium text-slate-400">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}