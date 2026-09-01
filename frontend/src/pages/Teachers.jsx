import { useEffect, useState } from "react";
import api from "../api/axios";
import TeacherAdmissionForm from "../components/TeacherAdmissionForm";

const API_ORIGIN = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");

function resolvePhotoUrl(photoUrl) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http")) return photoUrl;
  return `${API_ORIGIN}${photoUrl}`;
}

export default function Teachers({ isOpen }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState("");

  function loadTeachers() {
    setLoading(true);
    api
      .get("/teachers")
      .then((res) => setTeachers(res.data.teachers || res.data || []))
      .catch(() => setMessage("Failed to retrieve faculty records."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  async function handleCreateOrUpdate(formData) {
    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher._id}`, formData);
        setMessage("Faculty profile updated successfully.");
      } else {
        await api.post("/teachers", formData);
        setMessage("Faculty profile successfully synchronized into system directories.");
      }
      setShowForm(false);
      setEditingTeacher(null);
      loadTeachers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save faculty record.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this faculty member? This cannot be undone.")) return;
    try {
      await api.delete(`/teachers/${id}`);
      setMessage("Faculty member removed.");
      loadTeachers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not remove faculty record.");
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
            onClick={() => {
              setEditingTeacher(null);
              setShowForm((v) => !v);
            }}
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
          <div className="animate-fade-in-up">
            <TeacherAdmissionForm
              initialData={editingTeacher}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setShowForm(false);
                setEditingTeacher(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-500 gap-2 animate-fade-in-up">
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Querying faculty directory...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
            {teachers.length === 0 ? (
              <div className="col-span-full bg-slate-900/10 border border-slate-800/40 rounded-2xl p-16 text-center text-sm text-slate-500 italic">
                No authenticated faculty members currently registered in this workspace environment.
              </div>
            ) : (
              teachers.map((t) => {
                const photo = resolvePhotoUrl(t.photoUrl);
                const isExpanded = expandedId === t._id;
                return (
                  <div
                    key={t._id}
                    className="bg-slate-900/20 border border-slate-800/60 p-5 rounded-2xl backdrop-blur-sm flex flex-col justify-between gap-4 hover:border-slate-700 transition-all group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {photo ? (
                          <img src={photo} alt={t.name} className="h-9 w-9 rounded-xl object-cover border border-slate-700" />
                        ) : (
                          <div className="h-9 w-9 bg-cyan-950/40 text-cyan-400 border border-cyan-900/30 font-bold rounded-xl flex items-center justify-center text-sm">
                            {t.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors truncate">{t.name}</h4>
                          <p className="text-xs text-slate-500 font-mono truncate">{t.email}</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Specialty Matrix</span>
                        <span className="text-xs text-slate-300 font-medium">{t.primarySubject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span>{t.employeeId || "—"}</span>
                        <span>•</span>
                        <span>{t.employmentType || "Full-Time"}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/40">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Assigned Classes Scope</span>
                      <div className="flex flex-wrap gap-1">
                        {t.assignedClasses?.length > 0 ? (
                          t.assignedClasses.map((cls, idx) => (
                            <span key={idx} className="bg-slate-950 px-2 py-0.5 border border-slate-800/80 rounded text-[10px] font-mono font-medium text-slate-400">
                              {cls}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-600 italic">No classes assigned</span>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-800/40 grid grid-cols-2 gap-3 text-xs">
                        <DetailField label="Phone" value={t.phone || "—"} />
                        <DetailField label="CNIC" value={t.cnic || "—"} />
                        <DetailField label="Qualification" value={t.qualification || "—"} />
                        <DetailField label="Experience" value={t.experienceYears != null ? `${t.experienceYears} yrs` : "—"} />
                        <DetailField label="Department" value={t.department || "—"} />
                        <DetailField label="Joining Date" value={t.joiningDate ? new Date(t.joiningDate).toLocaleDateString() : "—"} />
                        <DetailField label="Monthly Salary" value={t.monthlySalary != null ? `PKR ${t.monthlySalary}` : "—"} />
                        <DetailField label="Emergency Contact" value={t.emergencyContact || "—"} />
                        <DetailField label="Address" value={t.address || "—"} className="col-span-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : t._id)}
                        className="text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {isExpanded ? "Hide Details" : "View Details"}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTeacher(t);
                            setShowForm(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-lg active:scale-95 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="px-2.5 py-1 text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg active:scale-95 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailField({ label, value, className = "" }) {
  return (
    <div className={className}>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">{label}</div>
      <div className="text-slate-300 truncate">{value}</div>
    </div>
  );
}