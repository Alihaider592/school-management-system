import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = { title: "", description: "", date: "", type: "meeting", classApplicable: "all" };

export default function Events() {
  const { user } = useAuth();
  const canCreate = user.role === "admin" || user.role === "teacher";

  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  function loadEvents() {
    api.get("/events").then((res) => setEvents(res.data.events));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/events", form);
      setForm(emptyForm);
      setShowForm(false);
      loadEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not create event.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not delete event.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Events & Calendar</h1>
        {canCreate && (
          <button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Close form" : "+ Add event"}
          </button>
        )}
      </div>

      {message && <div className="alert-error">{message}</div>}

      {showForm && canCreate && (
        <form className="inline-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </label>
            <label>
              Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="exam">Exam</option>
                <option value="holiday">Holiday</option>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
              </select>
            </label>
            <label>
              Class
              <input
                value={form.classApplicable}
                onChange={(e) => setForm({ ...form, classApplicable: e.target.value })}
                placeholder={user.role === "admin" ? "'all' or e.g. 10-B" : "e.g. 10-B"}
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </label>
          <button type="submit">Create event</button>
        </form>
      )}

      <ul className="event-list event-list--full">
        {events.length === 0 && <p className="muted">No events scheduled.</p>}
        {events.map((ev) => (
          <li key={ev._id}>
            <span className={`event-tag event-tag--${ev.type}`}>{ev.type}</span>
            <div className="event-details">
              <strong>{ev.title}</strong>
              <span className="muted">
                {new Date(ev.date).toLocaleDateString()} &middot; {ev.classApplicable}
              </span>
              {ev.description && <p>{ev.description}</p>}
            </div>
            {user.role === "admin" && (
              <button className="btn-small btn-danger" onClick={() => handleDelete(ev._id)}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
