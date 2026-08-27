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
    <form className="inline-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Roll Number
          <input name="rollNumber" value={form.rollNumber} onChange={handleChange} required />
        </label>
        <label>
          Class
          <input name="class" value={form.class} onChange={handleChange} required />
        </label>
        <label>
          Section
          <input name="section" value={form.section} onChange={handleChange} />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <label>
          Parent Phone
          <input name="parentPhone" value={form.parentPhone} onChange={handleChange} />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit">{initialData ? "Save changes" : "Add student"}</button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
