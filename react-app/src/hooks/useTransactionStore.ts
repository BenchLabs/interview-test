import { useEffect, useState } from 'react';
import { transactions as mockTransactions } from '../_mocks_/transactions';

const key = 'transactions';
const MOCK_TRANSACTION_COUNT = 50;

export type Transaction = {
  id: string;
  date: Date;
  details: string;
  amount: number;
  ledger: string;
};

const useTransactionStore = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (item) {
        setLoading(false);
        setTransactions(JSON.parse(item).map((t: any) => ({ ...t, date: new Date(t.date) })));
      } else {
        const initialValue = mockTransactions(MOCK_TRANSACTION_COUNT);
        saveToLocalStorage(initialValue);
        setTransactions(initialValue);

        // Simulate a delay for fake loading
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const saveToLocalStorage = (transactions: Transaction[]) => {
    try {
      setTransactions(transactions);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(transactions));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = [...transactions];
    updatedTransactions.filter((t) => t.id === id);
    saveToLocalStorage(updatedTransactions);
  };

  const saveTransaction = (transaction: Transaction) => {
    const updatedTransactions = [...transactions];
    // Remove the existing transaction if there is one
    updatedTransactions.filter((t) => t.id === transaction.id);
    // Add the new transaction
    updatedTransactions.push(transaction);
    saveToLocalStorage(updatedTransactions);
  };

  return { transactions, saveTransaction, deleteTransaction, loading };
};

export default useTransactionStore;
