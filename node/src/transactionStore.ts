import crypto from 'crypto';
import { transactions as mockTransactions } from './_mocks_/transactions';

export type Transaction = {
  id: string;
  date: Date;
  details: string;
  amount: number;
  category: string;
};

// In-memory data store
export class TransactionStore {
  private transactions: Transaction[] = [];

  getTransactions() {
    return this.transactions;
  }

  getTransactionsInRange({ startDate, endDate }: { startDate: Date; endDate: Date }) {
    return this.transactions.filter((transaction) => {
      return transaction.date >= startDate && transaction.date <= endDate;
    });
  }

  saveTransaction(newTransaction: Transaction) {
    if (!newTransaction.id) {
      newTransaction.id = crypto.randomUUID();
    }
    this.transactions.push(newTransaction);
  }

  __addMockData() {
    this.transactions.push(...mockTransactions(50));
  }
}

const store = new TransactionStore();
store.__addMockData();

export default {
  getInstance: () => store,
};
