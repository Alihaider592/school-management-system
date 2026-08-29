import { useState, useRef } from "react";

export default function StudentAdmissionForm({ onSubmitSuccess }) {
  const fileInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    // Student Personal Info
    fullName: "",
    dateOfBirth: "",
    gender: "",
    bFormNumber: "",
    bloodGroup: "",
    religion: "",
    nationality: "Pakistani",
    studentPhoto: null,

    // Student Portal Authentication
    studentEmail: "",
    username: "",
    password: "",

    // Parent / Guardian Info
    fatherName: "",
    fatherCnic: "",    
    fatherPosition: "",
    fatherDepartment: "", 
    fatherPhone: "",
    fatherEmail: "",
    emergencyContact: "",

    // Academic / Admission Meta Fields
    admissionClass: "",
    previousSchool: "",
    admissionDate: new Date().toISOString().split("T")[0],
    residentialAddress: "",

    // NEW: Fee & Financial Details
    admissionFee: "",
    monthlyTuitionFee: "",
    securityDeposit: "",
    feeDiscountPercent: "0",
    paymentStatus: "Pending",
    paymentMethod: "Bank Transfer",
  });

  // Automatically generates a basic username from the full name for convenience
  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    const cleanUsername = nameVal.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10) + Math.floor(100 + Math.random() * 900);
    
    setFormData((prev) => ({ 
      ...prev, 
      fullName: nameVal,
      username: prev.username ? prev.username : cleanUsername 
    }));
  };

  // Helper to quickly generate a secure temporary password
  const generateTempPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let generatedPass = "";
    for (let i = 0; i < 10; i++) {
      generatedPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: generatedPass }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admission Data Packet for DB & Email Dispatch:", formData);
    if (onSubmitSuccess) onSubmitSuccess(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto bg-slate-900 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-xl">
      {/* Header Matrix */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">New Student Admission Form</h2>
        <p className="mt-1 text-xs text-slate-400">Registering this form saves credentials to the DB and dispatches an automated access email.</p>
      </div>

      <div className="space-y-8">
        
        {/* SECTION 1: STUDENT PERSONAL INFO & PHOTO */}
        <div>
          <h3 className="text-sm font-bold tracking-wider text-cyan-400 uppercase mb-4">1. Student Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center border border-dashed border-slate-700 bg-slate-950/40 rounded-xl p-4 text-center group">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              {photoPreview ? (
                <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-slate-700">
                  <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => { setPhotoPreview(null); setFormData(p => ({...p, studentPhoto: null})) }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs font-bold text-red-400">Remove</button>
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

        {/* SECTION 2: PORTAL ACCESS & LOGIN CREDENTIALS SETUP */}
        <div className="border-t border-slate-800/60 pt-6">
          <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase mb-4">2. Portal Access Credentials</h3>
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
                <label className="text-xs font-bold text-slate-300">Portal Password *</label>
                <button type="button" onClick={generateTempPassword} className="text-[10px] font-bold text-emerald-400 hover:underline">Generate Secure</button>
              </div>
              <input required type="text" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm rounded-xl p-2.5 text-white outline-none transition-colors" placeholder="Enter or generate password" />
            </div>
          </div>
        </div>

        {/* SECTION 3: PARENT / GUARDIAN INFORMATION DETAILS */}
        <div className="border-t border-slate-800/60 pt-6">
          <h3 className="text-sm font-bold tracking-wider text-purple-400 uppercase mb-4">3. Parent / Guardian Information</h3>
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

        {/* SECTION 4: ACADEMIC & ENROLLMENT LOGISTICS */}
        <div className="border-t border-slate-800/60 pt-6">
          <h3 className="text-sm font-bold tracking-wider text-indigo-400 uppercase mb-4">4. Academic & Enrolment Metrics</h3>
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

        {/* NEW SECTION 5: FEE & FINANCIAL STRUCTURE */}
        <div className="border-t border-slate-800/60 pt-6">
          <h3 className="text-sm font-bold tracking-wider text-amber-400 uppercase mb-4">5. Fee & Financial Details</h3>
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

      </div>

      {/* Form Submission Actions Row */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
        <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-black tracking-wide text-white shadow-lg transition-all active:scale-[0.98]">
          Process Admission & Send Welcome Email
        </button>
      </div>
    </form>
  );
}