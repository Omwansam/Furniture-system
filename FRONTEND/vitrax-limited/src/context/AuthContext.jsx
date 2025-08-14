import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('furniture_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('furniture_user');
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/auth/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  const refreshToken = async (refreshTokenValue) => {
    try {
      const response = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshTokenValue}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = user ? {
          ...user,
          access_token: data.access_token
        } : null;

        if (updatedUser) {
          setUser(updatedUser);
          localStorage.setItem('furniture_user', JSON.stringify(updatedUser));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const login = async (email, password, role) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          id: data.user.id.toString(),
          email: data.user.email,
          username: data.user.username,
          role: data.user.role || (data.user.is_admin ? 'admin' : 'user'),
          access_token: data.access_token,
          refresh_token: data.refresh_token
        };

        setUser(userData);
        localStorage.setItem('furniture_user', JSON.stringify(userData));
        // Backward compatibility for modules reading from 'token'
        localStorage.setItem('token', data.access_token);
        if (userData.role === 'admin') {
          localStorage.setItem('adminToken', data.access_token);
          localStorage.setItem('adminRefreshToken', data.refresh_token);
        }
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Auto login after successful signup
        return await login(email, password, 'user');
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('furniture_user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loading,
      refreshToken: async () => {
        if (!user?.refresh_token) return false;
        return refreshToken(user.refresh_token);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
