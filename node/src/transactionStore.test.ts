import { Transaction, TransactionStore } from './transactionStore';

describe('TransactionStore', () => {
  let store: TransactionStore = new TransactionStore();

  test('getTransactions returns transactions array', () => {
    const result = store.getTransactions();
    expect(Array.isArray(result)).toBe(true);
  });

  test('getTransactionsInRange filters transactions correctly', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    const resultA = store.getTransactionsInRange({ startDate, endDate });
    expect(resultA.length).toBe(0);

    store.saveTransaction({
      id: 'someUniqueId',
      date: new Date('2024-01-15'),
      details: 'Some transaction details',
      amount: 50,
      category: 'income',
    });

    const resultB = store.getTransactionsInRange({ startDate, endDate });
    expect(resultB.length).toBe(1);
  });

  // TODO: This test works when you run it independently. Fix it so that it works when you run all tests.
  test.skip('saveTransaction adds a new transaction to the store', () => {
    const newTransaction: Transaction = {
      id: 'someUniqueId',
      date: new Date(),
      details: 'Some transaction details',
      amount: 50,
      category: 'income',
    };

    store.saveTransaction(newTransaction);
    expect(store.getTransactions()).toContainEqual(newTransaction);
    expect(store.getTransactions().length).toBe(1);
  });
});
