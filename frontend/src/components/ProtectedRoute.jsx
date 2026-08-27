import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page: <ProtectedRoute roles={['admin']}><AdminOnlyPage /></ProtectedRoute>
// Omit `roles` to just require "logged in", any role.
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="page-center">
        <h2>Access denied</h2>
        <p>Your role ({user.role}) doesn't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}
