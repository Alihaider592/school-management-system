import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setErrorMsg("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Loading dashboard...</div>;
  if (errorMsg) return <div className="page alert-error">{errorMsg}</div>;

  return (
    <div className="page">
      <h1>Welcome, {user.name}</h1>
      <p className="muted">
        You're logged in as <strong>{user.role}</strong>
        {user.role === "teacher" && user.assignedClasses?.length > 0 && (
          <> for class(es): {user.assignedClasses.join(", ")}</>
        )}
      </p>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-number">{data.totalStudents}</div>
          <div className="stat-label">
            {user.role === "parent" ? "Your children" : "Students in view"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.lowAttendanceAlerts.length}</div>
          <div className="stat-label">Low attendance alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.upcomingEvents.length}</div>
          <div className="stat-label">Upcoming events</div>
        </div>
      </div>

      {data.lowAttendanceAlerts.length > 0 && (
        <section className="section">
          <h2>Low Attendance Alerts</h2>
          <ul className="alert-list">
            {data.lowAttendanceAlerts.map((a) => (
              <li key={a.studentId}>
                <strong>{a.name}</strong> ({a.rollNumber}) &mdash; {a.attendancePercentage}% attendance
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section">
        <h2>Upcoming Events</h2>
        {data.upcomingEvents.length === 0 ? (
          <p className="muted">No upcoming events.</p>
        ) : (
          <ul className="event-list">
            {data.upcomingEvents.map((ev) => (
              <li key={ev._id}>
                <span className={`event-tag event-tag--${ev.type}`}>{ev.type}</span>
                <strong>{ev.title}</strong>
                <span className="muted"> &mdash; {new Date(ev.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
