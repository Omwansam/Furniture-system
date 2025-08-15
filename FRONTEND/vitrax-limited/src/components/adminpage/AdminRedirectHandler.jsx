import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRedirectHandler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/admin/login", { replace: true });
    }
  }, [user, navigate]);

  return null; // This component doesn't render anything
};

export default AdminRedirectHandler;
