import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock login function
  const login = async (email, password) => {
    setLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({
          id: '1',
          name: 'Demo User',
          email,
          token: 'mock-jwt-token',
          accounts: [
            { id: '1', name: 'Main Account', balance: 5420.50, number: '•••• 3456' },
            { id: '2', name: 'Savings', balance: 12500.75, number: '•••• 7890' }
          ]
        });
        setLoading(false);
        resolve(true);
      }, 1000);
    });
  };

  // Mock register function
  const register = async (userData) => {
    setLoading(true);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({
          id: '1',
          ...userData,
          token: 'mock-jwt-token',
          accounts: [{ id: '1', name: 'Main Account', balance: 0, number: '•••• ' + Math.floor(1000 + Math.random() * 9000) }]
        });
        setLoading(false);
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
