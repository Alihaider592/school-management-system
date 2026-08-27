import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Student Tracking System</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        {(user.role === "admin" || user.role === "teacher") && (
          <>
            <Link to="/students">Students</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/grades">Grades</Link>
          </>
        )}
        {user.role === "parent" && <Link to="/grades">My Child</Link>}
        <Link to="/events">Events</Link>
      </div>
      <div className="navbar-user">
        <span className="role-badge" data-role={user.role}>
          {user.role}
        </span>
        <span>{user.name}</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}
