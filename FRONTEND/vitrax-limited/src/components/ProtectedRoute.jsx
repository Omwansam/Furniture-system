import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children,  }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // If no token, redirect to login with intended path
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists but role is incorrect
  if ( role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

