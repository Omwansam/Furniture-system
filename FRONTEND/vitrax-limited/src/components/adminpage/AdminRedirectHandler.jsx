import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRedirectHandler = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // If still loading, wait
      if (loading) return;
      
      setIsRedirecting(true);
      
      // If no user is logged in, redirect to admin login
      if (!user) {
        navigate("/admin/login", { replace: true });
        return;
      }

      // If user is logged in and is admin, redirect to dashboard
      if (user.role === 'admin') {
        navigate("/admin/overview", { replace: true });
        return;
      }

      // If user is logged in but not admin, redirect to admin login
      navigate("/admin/login", { replace: true });
    };

    checkAuth();
  }, [navigate, user, loading]);

  // Show loading while auth is being checked or while redirecting
  if (loading || isRedirecting) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Checking admin session...</span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // This should never be reached due to navigation, but return null as fallback
  return null;
};

export default AdminRedirectHandler;
