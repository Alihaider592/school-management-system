import { useState, useRef, useEffect } from "react";

export default function TeacherAdmissionForm({ onSubmit, onCancel, initialData }) {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    cnic: "",
    teacherPhoto: null,

    email: "",
    phone: "",
    address: "",
    emergencyContact: "",

    username: "",
    password: "",

    primarySubject: "",
    qualification: "",
    experienceYears: "0",
    department: "",
    joiningDate: new Date().toISOString().split("T")[0],
    employmentType: "Full-Time",

    assignedClasses: "",

    monthlySalary: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // Pre-fill when editing an existing teacher — maps backend field names
  // (schema) to this form's field names.
  useEffect(() => {
    if (!initialData) {
      setFormData(emptyForm);
      setPhotoPreview(null);
      return;
    }

    setFormData({
      fullName: initialData.name || "",
      dateOfBirth: initialData.dob ? initialData.dob.split("T")[0] : "",
      gender: initialData.gender
        ? initialData.gender.charAt(0).toUpperCase() + initialData.gender.slice(1)
        : "",
      cnic: initialData.cnic || "",
      teacherPhoto: null, // never pre-fill a File object; existing photo shown via preview only

      email: initialData.email || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      emergencyContact: initialData.emergencyContact || "",

      username: initialData.username || "",
      password: "", // never pre-fill password; blank = keep existing on update

      primarySubject: initialData.primarySubject || "",
      qualification: initialData.qualification || "",
      experienceYears: initialData.experienceYears ?? "0",
      department: initialData.department || "",
      joiningDate: initialData.joiningDate
        ? initialData.joiningDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      employmentType: initialData.employmentType || "Full-Time",

      assignedClasses: Array.isArray(initialData.assignedClasses)
        ? initialData.assignedClasses.join(", ")
        : "",

      monthlySalary: initialData.monthlySalary ?? "",
    });

    setPhotoPreview(initialData.photoUrl || null);
    setActiveTab("personal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    const cleanUsername =
      nameVal.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) +
      Math.floor(100 + Math.random() * 900);

    setFormData((prev) => ({
      ...prev,
      fullName: nameVal,
      username: prev.username ? prev.username : cleanUsername,
    }));
  };

  const generateTempPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let generatedPass = "";
    for (let i = 0; i < 10; i++) {
      generatedPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: generatedPass }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, teacherPhoto: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = new FormData();
    payload.append("name", formData.fullName);
    payload.append("dob", formData.dateOfBirth);
    payload.append("gender", formData.gender.toLowerCase());
    payload.append("cnic", formData.cnic);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("address", formData.address);
    payload.append("emergencyContact", formData.emergencyContact);
    payload.append("username", formData.username);
    if (formData.password) {
      payload.append("password", formData.password);
    }
    payload.append("primarySubject", formData.primarySubject);
    payload.append("qualification", formData.qualification);
    payload.append("experienceYears", formData.experienceYears);
    payload.append("department", formData.department);
    payload.append("joiningDate", formData.joiningDate);
    payload.append("employmentType", formData.employmentType);
    payload.append("assignedClasses", formData.assignedClasses); // comma-separated string; backend splits into array
    payload.append("monthlySalary", formData.monthlySalary);
    if (formData.teacherPhoto) {
      payload.append("teacherPhoto", formData.teacherPhoto);
    }

    try {
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: "personal", step: "01", label: "Personal" },
    { id: "credentials", step: "02", label: "Portal Access" },
    { id: "professional", step: "03", label: "Professional" },
    { id: "assignment", step: "04", label: "Assignment" },
  ];

  const tabColors = {
    personal: { active: "bg-cyan-500 text-slate-950 shadow-cyan-500/25", focus: "focus:border-cyan-500", dot: "bg-cyan-400", text: "text-cyan-400" },
    credentials: { active: "bg-emerald-500 text-slate-950 shadow-emerald-500/25", focus: "focus:border-emerald-500", dot: "bg-emerald-400", text: "text-emerald-400" },
    professional: { active: "bg-indigo-500 text-slate-950 shadow-indigo-500/25", focus: "focus:border-indigo-500", dot: "bg-indigo-400", text: "text-indigo-400" },
    assignment: { active: "bg-amber-500 text-slate-950 shadow-amber-500/25", focus: "focus:border-amber-500", dot: "bg-amber-400", text: "text-amber-400" },
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800/80 rounded-2xl text-slate-100 shadow-2xl overflow-hidden">

      <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-slate-900/50">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {initialData ? "Edit Faculty Profile" : "New Faculty Onboarding"}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {initialData ? "Update this teacher's information below." : "Complete the step-by-step onboarding wizard below."}
        </p>
      </div>

      <div className="bg-slate-950/90 p-3 border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto p-1 bg-slate-900/80 rounded-xl border border-slate-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] sm:min-w-0 flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-300 outline-none select-none ${
                  isActive
                    ? `${tabColors[tab.id].active} shadow-md scale-[1.02]`
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <span className="tracking-wide whitespace-nowrap">{tab.step}. {tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 sm:p-8 min-h-[360px]">

        {/* TAB 1: PERSONAL */}
        {activeTab === "personal" && (
          <div>
            <h3 className={`text-sm font-bold tracking-wider ${tabColors.personal.text} uppercase mb-6 flex items-center gap-2`}>
              <span className={`h-2 w-2 rounded-full ${tabColors.personal.dot}`} />
              1. Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/40 rounded-xl p-4 text-center group">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                {photoPreview ? (
                  <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-slate-700">
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => { setPhotoPreview(null); setFormData((p) => ({ ...p, teacherPhoto: null })); }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs font-bold text-red-400">Remove</button>
                  </div>
                ) : (
                  <button type="button" onClick={triggerFileSelect} className="flex flex-col items-center justify-center h-32 w-32 rounded-lg bg-slate-800/40 hover:bg-slate-800 transition-all border border-slate-700 text-slate-400 hover:text-slate-200">
                    <svg className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[11px] font-medium">Upload Photo</span>
                  </button>
                )}
                <p className="text-[10px] text-slate-500 mt-2">Max 2MB. JPG or PNG.</p>
              </div>

              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleNameChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.personal.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="Dr. Sarah Jenkins" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">CNIC Number *</label>
                  <input required type="text" name="cnic" value={formData.cnic} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.personal.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="42xxx-xxxxxxx-x" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.personal.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.personal.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.personal.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="03xx-xxxxxxx" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Emergency Contact</label>
                  <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.personal.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="Secondary contact number" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Residential Address</label>
                  <textarea rows="2" name="address" value={formData.address} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.personal.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors resize-none`} placeholder="Complete physical address..." />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTAL ACCESS */}
        {activeTab === "credentials" && (
          <div>
            <h3 className={`text-sm font-bold tracking-wider ${tabColors.credentials.text} uppercase mb-6 flex items-center gap-2`}>
              <span className={`h-2 w-2 rounded-full ${tabColors.credentials.dot}`} />
              2. Portal Access Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.credentials.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="teacher@institution.edu" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Username *</label>
                <input required type="text" name="username" value={formData.username} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.credentials.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="teacher.login.id" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Portal Password {initialData ? "" : "*"}
                  </label>
                  <button type="button" onClick={generateTempPassword} className="text-[10px] font-bold text-emerald-400 hover:underline">Generate Secure</button>
                </div>
                <input
                  required={!initialData}
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-slate-950 border border-slate-800 ${tabColors.credentials.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`}
                  placeholder={initialData ? "Leave blank to keep current password" : "Enter or generate password"}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFESSIONAL */}
        {activeTab === "professional" && (
          <div>
            <h3 className={`text-sm font-bold tracking-wider ${tabColors.professional.text} uppercase mb-6 flex items-center gap-2`}>
              <span className={`h-2 w-2 rounded-full ${tabColors.professional.dot}`} />
              3. Professional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Primary Subject *</label>
                <input required type="text" name="primarySubject" value={formData.primarySubject} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.professional.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="Organic Chemistry" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Qualification</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.professional.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="M.Sc, B.Ed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Experience (Years)</label>
                <input type="number" min="0" name="experienceYears" value={formData.experienceYears} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.professional.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="5" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.professional.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="Science Department" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Joining Date</label>
                <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.professional.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Employment Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.professional.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Visiting">Visiting</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENT & COMPENSATION */}
        {activeTab === "assignment" && (
          <div>
            <h3 className={`text-sm font-bold tracking-wider ${tabColors.assignment.text} uppercase mb-6 flex items-center gap-2`}>
              <span className={`h-2 w-2 rounded-full ${tabColors.assignment.dot}`} />
              4. Class Assignment & Compensation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Assigned Classes (comma-separated)</label>
                <input type="text" name="assignedClasses" value={formData.assignedClasses} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.assignment.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="10-A, 11-B, 12-C" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Monthly Salary (PKR)</label>
                <input type="number" min="0" name="monthlySalary" value={formData.monthlySalary} onChange={handleChange} className={`w-full bg-slate-950 border border-slate-800 ${tabColors.assignment.focus} text-sm rounded-xl p-2.5 text-white outline-none transition-colors`} placeholder="60000" />
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="p-6 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {activeTab !== "personal" && (
            <button
              type="button"
              onClick={() => {
                const idx = tabs.findIndex((t) => t.id === activeTab);
                if (idx > 0) setActiveTab(tabs[idx - 1].id);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
            >
              ← Back
            </button>
          )}
          {activeTab !== "assignment" && (
            <button
              type="button"
              onClick={() => {
                const idx = tabs.findIndex((t) => t.id === activeTab);
                if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-white transition-colors"
            >
              Continue →
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-black tracking-wide text-white shadow-lg shadow-cyan-950/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : initialData ? "Update Faculty Record" : "Onboard Faculty Member"}
          </button>
        </div>
      </div>
    </form>
  );
}