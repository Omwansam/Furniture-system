import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRedirectHandler = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      // If still loading, wait
      if (loading) return;
      
      // If no user is logged in, redirect to admin login
      if (!user) {
        navigate("/admin/login");
        return;
      }

      // If user is logged in and is admin, redirect to dashboard
      if (user.role === 'admin') {
        navigate("/admin/overview", { replace: true });
        return;
      }

      // If user is logged in but not admin, redirect to admin login
      navigate("/admin/login");
    };

    checkAuth();
  }, [navigate, user, loading]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Checking admin session...
      </div>
    );
  }

  return null;
};




export default AdminRedirectHandler;

