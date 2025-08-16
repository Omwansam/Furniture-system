
// src/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    // If trying to access admin routes, redirect to admin login
    if (roles.includes('admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    // Otherwise redirect to regular login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    // If user doesn't have the required role, redirect appropriately
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard/overview" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};