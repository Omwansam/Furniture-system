

import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./auth.css";
import { useAuth } from "../context/AuthContext";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // If already logged in as admin, redirect
  useEffect(() => {
    const user = localStorage.getItem("furniture_user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'admin') {
        navigate("/admin/dashboard/overview");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password, 'admin');
      if (result && result.success && result.role === 'admin') {
        navigate("/admin/dashboard/overview");
      } else {
        setError(result?.error || "Login failed. Please check your credentials or ensure you have admin access.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Admin Login</h2>
          <p>Welcome back, admin!</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              <span>Password</span>
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ 
              color: '#e74c3c', 
              backgroundColor: '#fdf2f2', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '15px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '5px', fontSize: '14px', border: '1px solid #2196f3' }}>
          <strong>💡 Demo Info:</strong><br />
          <strong>Admin Credentials:</strong><br />
          Email: admin2@example.com<br />
          Password: securepassword1234<br />
          <br />
          <strong>Or register a new admin:</strong><br />
          Username: admin2_user<br />
          Email: admin2@example.com<br />
          Password: securepassword1234<br />
          is_admin: true
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Don't have an admin account? <a href="/admin/register" style={{ color: '#2563eb' }}>Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
