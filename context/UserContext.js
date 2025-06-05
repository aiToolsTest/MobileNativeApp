import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState('');
  const [accounts, setAccounts] = useState([]);

  const setUser = ({ userId, fullName }) => {
    setUserId(userId);
    setFullName(fullName);
  };

  const clearUser = () => {
    setUserId(null);
    setFullName('');
    setAccounts([]);
  };

  return (
    <UserContext.Provider
      value={{ userId, fullName, accounts, setUser, setAccounts, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
