import React, { createContext, useContext, useState, useEffect } from 'react';
import { me, logout as apiLogout } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('smarthire_token');
      if (token) {
        try {
          const userData = await me();
          setUser(userData);
        } catch (err) {
          console.error('Auth init failed', err);
          apiLogout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('smarthire_token', token);
    setUser(userData);
  };

  const logoutUser = () => {
    apiLogout();
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      loginUser,
      logoutUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
