import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StudentForm from "../components/StudentForm";

const API_ORIGIN = (import.meta.env?.VITE_API_URL || "http://localhost:5000").replace(/\/api\/?$/, "");

function resolvePhotoUrl(photoUrl) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http")) return photoUrl;
  return `${API_ORIGIN}${photoUrl}`;
}

function paymentBadgeClasses(status) {
  switch (status) {
    case "Paid":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Partially Paid":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Pending":
    default:
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  }
}

// Pass isOpen from your main layout layer to synchronize layout shifts
export default function Students({ isOpen }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  function loadStudents() {
    setLoading(true);
    const params = search ? { search } : {};
    api
      .get("/students", { params })
      .then((res) => setStudents(res.data.students || res.data))
      .catch(() => setErrorMsg("Could not load students register."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadStudents();
  }

  async function handleCreateOrUpdate(formData) {
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, formData);
      } else {
        await api.post("/students", formData);
      }
      setShowForm(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not save student record.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    try {
      await api.delete(`/students/${id}`);
      loadStudents();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Could not complete deletion.");
    }
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

        {/* Dynamic Page Header */}
        <div className="space-y-2 border-b border-slate-800/60 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Student Directory
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage pupil enrollment information logs, classes, and contacts.</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingStudent(null);
                setShowForm((v) => !v);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 active:scale-95 shrink-0 ${
                showForm
                  ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                  : "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10"
              }`}
            >
              {showForm ? "✕ Close Registration Form" : "+ Enroll Student"}
            </button>
          )}
        </div>

        {/* Global Error Alerts */}
        {errorMsg && (
          <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-400 text-sm flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-400 font-bold">&times;</button>
          </div>
        )}

        {/* Modular Enrollment Form Container */}
        {showForm && isAdmin && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm ring-1 ring-indigo-500/10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-4">
              {editingStudent ? "Modify Student Profile" : "New Pupil Ingestion Matrix"}
            </h3>
            <StudentForm
              initialData={editingStudent}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
            />
          </div>
        )}

        {/* Utility Search & Filter Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 rounded-xl text-sm font-medium transition-all"
          >
            Search
          </button>
        </form>

        {/* Primary Records Table Matrix */}
        {loading ? (
          <div className="py-20 flex justify-center items-center text-slate-500 gap-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Querying active registry...</span>
          </div>
        ) : (
          <div className="bg-slate-900/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/60 border-b border-slate-800/80">
                  <tr>
                    <th className="p-4 font-semibold tracking-wider">Student</th>
                    <th className="p-4 font-semibold tracking-wider">Roll No.</th>
                    <th className="p-4 font-semibold tracking-wider">Class</th>
                    <th className="p-4 font-semibold tracking-wider">Father / Guardian</th>
                    <th className="p-4 font-semibold tracking-wider">Contact</th>
                    <th className="p-4 font-semibold tracking-wider">Fee Status</th>
                    {isAdmin && <th className="p-4 font-semibold tracking-wider text-right">Control Rig</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-sm text-slate-500 italic">
                        No active records returned matching the filter query.
                      </td>
                    </tr>
                  )}
                  {students.map((s) => {
                    const photo = resolvePhotoUrl(s.photoUrl);
                    const isExpanded = expandedId === s._id;
                    return (
                      <>
                        <tr
                          key={s._id}
                          onClick={() => setExpandedId(isExpanded ? null : s._id)}
                          className="hover:bg-slate-900/30 group transition-colors duration-150 cursor-pointer"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {photo ? (
                                <img
                                  src={photo}
                                  alt={s.name}
                                  className="h-9 w-9 rounded-full object-cover border border-slate-700 shrink-0"
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-400 shrink-0">
                                  {s.name ? s.name.charAt(0).toUpperCase() : "?"}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-medium text-white group-hover:text-indigo-400 transition-colors truncate">
                                  {s.name}
                                </div>
                                {s.email && (
                                  <div className="text-[11px] text-slate-500 truncate">{s.email}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-400">{s.rollNumber}</td>
                          <td className="p-4 text-slate-300">
                            <span>{s.class}</span>
                            {s.section && (
                              <span className="ml-2 px-2 py-0.5 bg-slate-800/80 text-slate-400 border border-slate-700/40 text-[11px] rounded font-medium">
                                {s.section}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-slate-300">{s.fatherName || "—"}</td>
                          <td className="p-4 text-slate-400 font-mono text-xs">
                            {s.fatherPhone || s.phone || "No Phone"}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-[11px] rounded border font-medium ${paymentBadgeClasses(s.paymentStatus)}`}>
                              {s.paymentStatus || "Pending"}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="p-4 text-right space-x-2 shrink-0 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setEditingStudent(s);
                                  setShowForm(true);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-lg active:scale-95 transition-all"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(s._id)}
                                className="px-2.5 py-1 text-xs bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg active:scale-95 transition-all"
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>

                        {/* Expandable detail row — click a row to see the rest of the record */}
                        {isExpanded && (
                          <tr className="bg-slate-950/60">
                            <td colSpan={isAdmin ? 7 : 6} className="p-5">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
                                <DetailField label="Date of Birth" value={s.dob ? new Date(s.dob).toLocaleDateString() : "—"} />
                                <DetailField label="Gender" value={s.gender || "—"} />
                                <DetailField label="B-Form No." value={s.bFormNumber || "—"} />
                                <DetailField label="Blood Group" value={s.bloodGroup || "—"} />
                                <DetailField label="Religion" value={s.religion || "—"} />
                                <DetailField label="Nationality" value={s.nationality || "—"} />
                                <DetailField label="Username" value={s.username || "—"} />
                                <DetailField label="Father's CNIC" value={s.fatherCnic || "—"} />
                                <DetailField label="Father's Occupation" value={s.fatherPosition || "—"} />
                                <DetailField label="Father's Department" value={s.fatherDepartment || "—"} />
                                <DetailField label="Father's Email" value={s.fatherEmail || "—"} />
                                <DetailField label="Emergency Contact" value={s.emergencyContact || "—"} />
                                <DetailField label="Previous School" value={s.previousSchool || "—"} />
                                <DetailField label="Enrollment Date" value={s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : "—"} />
                                <DetailField label="Admission Fee" value={s.admissionFee != null ? `PKR ${s.admissionFee}` : "—"} />
                                <DetailField label="Monthly Tuition" value={s.monthlyTuitionFee != null ? `PKR ${s.monthlyTuitionFee}` : "—"} />
                                <DetailField label="Security Deposit" value={s.securityDeposit != null ? `PKR ${s.securityDeposit}` : "—"} />
                                <DetailField label="Fee Discount" value={s.feeDiscountPercent != null ? `${s.feeDiscountPercent}%` : "—"} />
                                <DetailField label="Payment Method" value={s.paymentMethod || "—"} />
                                <DetailField label="Address" value={s.address || "—"} className="col-span-2 sm:col-span-3 md:col-span-2" />
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
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