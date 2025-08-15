import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRedirectHandler = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('AdminRedirectHandler - user:', user);
    console.log('AdminRedirectHandler - loading:', loading);

    if (loading) return;

    if (!user) {
      console.log('No user, redirecting to admin login');
      navigate("/admin/login", { replace: true });
    } else if (user.role === 'admin') {
      console.log('Admin user, redirecting to dashboard');
      navigate("/admin/overview", { replace: true });
    } else {
      console.log('Non-admin user, redirecting to admin login');
      navigate("/admin/login", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#333',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div>🔄 Checking admin session...</div>
        <div style={{ fontSize: '14px', marginTop: '10px', color: '#666' }}>
          Loading: {loading ? 'Yes' : 'No'} | User: {user ? user.username || 'Unknown' : 'None'}
        </div>
      </div>
    </div>
  );
};

export default AdminRedirectHandler;


