import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check sessionStorage first for per-tab session isolation, then fallback to localStorage
    const savedSession = sessionStorage.getItem('pm_user') || localStorage.getItem('pm_user');
    if (savedSession) {
      try { return JSON.parse(savedSession); } catch (e) { return null; }
    }
    return null;
  });

  const login = async (email, password) => {
    const userData = await apiLogin(email, password);
    setUser(userData);
    // Use sessionStorage to ensure multi-tab session isolation
    sessionStorage.setItem('pm_user', JSON.stringify(userData));
    localStorage.setItem('pm_user', JSON.stringify(userData));
    if (userData.token) {
      sessionStorage.setItem('pm_token', userData.token);
      localStorage.setItem('pm_token', userData.token);
    }
    return userData;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    localStorage.removeItem('pm_user');
    localStorage.removeItem('pm_token');
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedFields };
      sessionStorage.setItem('pm_user', JSON.stringify(newUser));
      localStorage.setItem('pm_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
