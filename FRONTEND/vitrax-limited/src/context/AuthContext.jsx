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

        // Verify token is still valid
        verifyToken(parsedUser.access_token).catch(() => {
          // If token verification fails, try refreshing
          if (parsedUser.refresh_token) {
            refreshToken(parsedUser.refresh_token).catch(() => {
              // If refresh fails, logout
              logout();
            });
          } else {
            logout();
          }
        });
      } catch (error) {
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
          role: data.user.role || (data.user.is_admin ? 'admin' : 'customer'),
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
        return await login(email, password, 'customer');
      }

      setLoading(false);
      return false;
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('furniture_user');
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
