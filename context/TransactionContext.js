import React, { createContext, useContext, useState } from 'react';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // Initial dummy data for demonstration
  const [transactions, setTransactions] = useState([
    {
      id: 't1',
      type: 'sent',
      fromAccount: 'Checking',
      toAccount: 'Dining',
      description: 'Dinner',
      date: '2023-06-15T19:30:00',
      status: 'completed',
      category: 'food',
    },
    {
      id: 't2',
      type: 'received',
      fromAccount: 'Savings',
      toAccount: 'Checking',
      description: 'Reimbursement',
      date: '2023-06-10T14:15:00',
      status: 'completed',
      category: 'transfer',
    },
    {
      id: 't3',
      type: 'sent',
      fromAccount: 'Checking',
      toAccount: 'Rent',
      description: 'Rent',
      date: '2023-06-05T09:00:00',
      status: 'completed',
      category: 'bills',
    },
    {
      id: 't4',
      type: 'sent',
      fromAccount: 'Checking',
      toAccount: 'Groceries',
      description: 'Groceries',
      date: '2023-05-25T17:20:00',
      status: 'pending',
      category: 'shopping',
    },
    {
      id: 't5',
      type: 'sent',
      fromAccount: 'Checking',
      toAccount: 'Subscription',
      description: 'Monthly subscription',
      date: '2023-05-15T00:00:00',
      status: 'completed',
      category: 'subscription',
    },
    {
      id: 't6',
      type: 'received',
      fromAccount: 'Income',
      toAccount: 'Savings',
      description: 'Web development',
      date: '2023-05-01T12:00:00',
      status: 'completed',
      category: 'income',
    },
  ]);

  // Calculate balance based on transactions
  const balance = transactions.reduce((acc, tx) => {
    if (tx.type === 'sent') return acc - tx.amount;
    if (tx.type === 'received') return acc + tx.amount;
    return acc;
  }, 1000);

  // Add a new transaction
  const addTransaction = (transaction) => {
    // Ensure only fromAccount and toAccount are used (no recipient/sender)
    const { fromAccount, toAccount, ...rest } = transaction;
    setTransactions((prev) => [
      {
        ...rest,
        fromAccount,
        toAccount,
        id: `t${Date.now()}`,
        date: new Date().toISOString(),
        status: 'completed',
      },
      ...prev,
    ]);
  };


  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, balance }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
