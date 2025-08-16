import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRedirectHandler = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user?.role === 'admin') {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/admin/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null; // This component doesn't render anything
};

export default AdminRedirectHandler;