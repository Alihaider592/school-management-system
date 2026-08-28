import { useState, useEffect } from "react";

const emptyForm = {
  name: "",
  rollNumber: "",
  class: "",
  section: "",
  email: "",
  phone: "",
  parentPhone: "",
};

export default function StudentForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({ ...emptyForm, ...initialData });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Responsive multi-column layout grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Full Name <span className="text-indigo-400">*</span>
          </label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="John Doe"
            required 
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Roll Number <span className="text-indigo-400">*</span>
          </label>
          <input 
            name="rollNumber" 
            value={form.rollNumber} 
            onChange={handleChange} 
            placeholder="e.g. 1001"
            required 
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Class <span className="text-indigo-400">*</span>
          </label>
          <input 
            name="class" 
            value={form.class} 
            onChange={handleChange} 
            placeholder="e.g. 10"
            required 
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Section
          </label>
          <input 
            name="section" 
            value={form.section} 
            onChange={handleChange} 
            placeholder="e.g. White"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="student@academy.com"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Student Phone
          </label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            placeholder="03000000000"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Parent Contact Phone
          </label>
          <input 
            name="parentPhone" 
            value={form.parentPhone} 
            onChange={handleChange} 
            placeholder="03000000000"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

      </div>

      {/* Structured Action Triggers Panel */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 rounded-xl transition-all active:scale-95"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit"
          className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 shadow-lg shadow-indigo-600/10 rounded-xl transition-all active:scale-95"
        >
          {initialData ? "Save Record Changes" : "Commit Ingestion Log"}
        </button>
      </div>
    </form>
  );
}