import { useState, useRef, useEffect } from "react";

export default function StudentAdmissionForm({ onSubmit, onCancel, initialData }) {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    bFormNumber: "",
    bloodGroup: "",
    religion: "",
    nationality: "Pakistani",
    studentPhoto: null,

    studentEmail: "",
    username: "",
    password: "",

    fatherName: "",
    fatherCnic: "",
    fatherPosition: "",
    fatherDepartment: "",
    fatherPhone: "",
    fatherEmail: "",
    emergencyContact: "",

    admissionClass: "",
    previousSchool: "",
    admissionDate: new Date().toISOString().split("T")[0],
    residentialAddress: "",

    admissionFee: "",
    monthlyTuitionFee: "",
    securityDeposit: "",
    feeDiscountPercent: "0",
    paymentStatus: "Pending",
    paymentMethod: "Bank Transfer",
  };

  const [formData, setFormData] = useState(emptyForm);

  // Pre-fill the form when editing an existing student.
  // Maps backend field names (schema) -> this form's field names.
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
      bFormNumber: initialData.bFormNumber || "",
      bloodGroup: initialData.bloodGroup || "",
      religion: initialData.religion || "",
      nationality: initialData.nationality || "Pakistani",
      studentPhoto: null, // never pre-fill a File object; existing photo shown via preview only

      studentEmail: initialData.email || "",
      username: initialData.username || "",
      password: "", // never pre-fill password; leave blank = keep existing on update

      fatherName: initialData.fatherName || "",
      fatherCnic: initialData.fatherCnic || "",
      fatherPosition: initialData.fatherPosition || "",
      fatherDepartment: initialData.fatherDepartment || "",
      fatherPhone: initialData.fatherPhone || "",
      fatherEmail: initialData.fatherEmail || "",
      emergencyContact: initialData.emergencyContact || "",

      admissionClass: initialData.class || "",
      previousSchool: initialData.previousSchool || "",
      admissionDate: initialData.enrollmentDate
        ? initialData.enrollmentDate.split("T")[0]
        : new Date().toISOString().split("T")[0],
      residentialAddress: initialData.address || "",

      admissionFee: initialData.admissionFee ?? "",
      monthlyTuitionFee: initialData.monthlyTuitionFee ?? "",
      securityDeposit: initialData.securityDeposit ?? "",
      feeDiscountPercent: initialData.feeDiscountPercent ?? "0",
      paymentStatus: initialData.paymentStatus || "Pending",
      paymentMethod: initialData.paymentMethod || "Bank Transfer",
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
      setFormData((prev) => ({ ...prev, studentPhoto: file }));
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
    payload.append("bFormNumber", formData.bFormNumber);
    payload.append("bloodGroup", formData.bloodGroup);
    payload.append("religion", formData.religion);
    payload.append("nationality", formData.nationality);
    payload.append("email", formData.studentEmail);
    payload.append("username", formData.username);
    // Only send password if the user actually typed/generated one.
    // Prevents wiping an existing password with an empty string on edit.
    if (formData.password) {
      payload.append("password", formData.password);
    }
    payload.append("fatherName", formData.fatherName);
    payload.append("fatherCnic", formData.fatherCnic);
    payload.append("fatherPosition", formData.fatherPosition);
    payload.append("fatherDepartment", formData.fatherDepartment);
    payload.append("fatherPhone", formData.fatherPhone);
    payload.append("fatherEmail", formData.fatherEmail);
    payload.append("emergencyContact", formData.emergencyContact);
    payload.append("class", formData.admissionClass);
    payload.append("previousSchool", formData.previousSchool);
    payload.append("enrollmentDate", formData.admissionDate);
    payload.append("address", formData.residentialAddress);
    payload.append("admissionFee", formData.admissionFee);
    payload.append("monthlyTuitionFee", formData.monthlyTuitionFee);
    payload.append("securityDeposit", formData.securityDeposit);
    payload.append("feeDiscountPercent", formData.feeDiscountPercent);
    payload.append("paymentStatus", formData.paymentStatus);
    payload.append("paymentMethod", formData.paymentMethod);
    if (formData.studentPhoto) {
      payload.append("studentPhoto", formData.studentPhoto);
    }

    try {
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  // Enhanced Tab Metadata with Icons & Colors
  const tabs = [
    {
      id: "personal",
      step: "01",
      label: "Personal",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      activeColor: "bg-cyan-500 text-slate-950 shadow-cyan-500/25",
      textColor: "text-cyan-400",
    },
    {
      id: "credentials",
      step: "02",
      label: "Portal Access",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      activeColor: "bg-emerald-500 text-slate-950 shadow-emerald-500/25",
      textColor: "text-emerald-400",
    },
    {
      id: "parent",
      step: "03",
      label: "Parent Info",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      activeColor: "bg-purple-500 text-slate-950 shadow-purple-500/25",
      textColor: "text-purple-400",
    },
    {
      id: "academic",
      step: "04",
      label: "Academic",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      activeColor: "bg-indigo-500 text-slate-950 shadow-indigo-500/25",
      textColor: "text-indigo-400",
    },
    {
      id: "fees",
      step: "05",
      label: "Fee Structure",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      activeColor: "bg-amber-500 text-slate-950 shadow-amber-500/25",
      textColor: "text-amber-400",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800/80 rounded-2xl text-slate-100 shadow-2xl overflow-hidden">

      {/* Header Matrix */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-slate-900/50">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          {initialData ? "Edit Student Profile" : "New Student Admission Form"}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {initialData
            ? "Update the pupil's information below."
            : "Complete the step-by-step registration wizard below."}
        </p>
      </div>

      {/* Modern Floating Segmented Navigation Bar */}
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
                    ? `${tab.activeColor} shadow-md scale-[1.02]`
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "opacity-70"}`}>
                  {tab.icon}
                </span>
                <span className="tracking-wide whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="p-6 sm:p-8 min-h-[380px]">

        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === "personal" && (
          <div>
            <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              1. Student Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/40 rounded-xl p-4 text-center group">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                {photoPreview ? (
                  <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-slate-700">
                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => { setPhotoPreview(null); setFormData(p => ({ ...p, studentPhoto: null })) }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs font-bold text-red-400">Remove</button>
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
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleNameChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="Muhammad Ahmed" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Student B-Form Number *</label>
                  <input required type="text" name="bFormNumber" value={formData.bFormNumber} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="xxxxx-xxxxxxx-x" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Date of Birth *</label>
                  <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Gender *</label>
                  <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTAL ACCESS */}
        {activeTab === "credentials" && (
          <div>
            <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              2. Portal Access Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Student Email Address *</label>
                <input required type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="student@school.com" />
                <p className="text-[10px] text-slate-500 mt-1">Credentials will be delivered to this inbox instantly.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Username *</label>
                <input required type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="student.login.id" />
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
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors"
                  placeholder={initialData ? "Leave blank to keep current password" : "Enter or generate password"}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PARENT / GUARDIAN INFORMATION */}
        {activeTab === "parent" && (
          <div>
            <h3 className="text-sm font-bold tracking-wider text-purple-400 uppercase mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              3. Parent / Guardian Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Father's Name *</label>
                <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="Father's Legal Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Father's CNIC Number *</label>
                <input required type="text" name="fatherCnic" value={formData.fatherCnic} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="42xxx-xxxxxxx-x" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Father's Occupation / Position</label>
                <input type="text" name="fatherPosition" value={formData.fatherPosition} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="e.g. Mechanical Engineer" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Father's Department / Org</label>
                <input type="text" name="fatherDepartment" value={formData.fatherDepartment} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="e.g. Operations Department" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Contact Phone Number *</label>
                <input required type="tel" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="03xx-xxxxxxx" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Father's Email Address</label>
                <input type="email" name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="parent@example.com" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACADEMIC & ENROLLMENT */}
        {activeTab === "academic" && (
          <div>
            <h3 className="text-sm font-bold tracking-wider text-indigo-400 uppercase mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              4. Academic & Enrolment Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Admission Class / Grade *</label>
                <input required type="text" name="admissionClass" value={formData.admissionClass} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="e.g. Grade 9, Computer Science" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Previous School Attended (If any)</label>
                <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="School Name, City" />
              </div>
              <div className="sm:col-span-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Admission Registration Date</label>
                <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" />
              </div>
              <div className="sm:col-span-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Emergency Alternative Phone *</label>
                <input required type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="Secondary contact number" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Current Residential Address *</label>
              <textarea required rows="2" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors resize-none" placeholder="Complete physical address..." />
            </div>
          </div>
        )}

        {/* TAB 5: FEE & FINANCIAL DETAILS */}
        {activeTab === "fees" && (
          <div>
            <h3 className="text-sm font-bold tracking-wider text-amber-400 uppercase mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              5. Fee & Financial Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Admission Fee (PKR) *</label>
                <input required type="number" name="admissionFee" value={formData.admissionFee} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="15000" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Monthly Tuition Fee (PKR) *</label>
                <input required type="number" name="monthlyTuitionFee" value={formData.monthlyTuitionFee} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="8000" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Security Deposit (Refundable)</label>
                <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="5000" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Fee Discount / Scholarship (%)</label>
                <input type="number" min="0" max="100" name="feeDiscountPercent" value={formData.feeDiscountPercent} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="0" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Initial Payment Status *</label>
                <select required name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Form Bottom Navigation & Submit Bar */}
      <div className="p-6 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {activeTab !== "personal" && (
            <button
              type="button"
              onClick={() => {
                const idx = tabs.findIndex(t => t.id === activeTab);
                if (idx > 0) setActiveTab(tabs[idx - 1].id);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
            >
              ← Back
            </button>
          )}

          {activeTab !== "fees" && (
            <button
              type="button"
              onClick={() => {
                const idx = tabs.findIndex(t => t.id === activeTab);
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
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-black tracking-wide text-white shadow-lg shadow-emerald-950/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Saving..."
              : initialData
              ? "Update Student Record"
              : "Process Admission & Send Email"}
          </button>
        </div>
      </div>
    </form>
  );
}