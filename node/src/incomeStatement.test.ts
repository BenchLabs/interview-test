import { calcIncomeStatement, formatIncomeStatement } from './incomeStatement';

describe('calcIncomeStatement', () => {
  test('it calculates income statement correctly', () => {
    const transactions = [
      { id: '1', details: 'Test 1', ledger: 'Service Revenue', amount: 100, date: new Date() },
      { id: '2', details: 'Test 2', ledger: 'Cost of Goods Sold', amount: -30, date: new Date() },
      {
        id: '3',
        details: 'Test 3',
        ledger: 'Marketing or Advertising',
        amount: 50,
        date: new Date(),
      },
    ];

    const result = calcIncomeStatement(transactions);

    expect(result.revenues.total).toBe(100);
    expect(result.expenses.total).toBe(50);
  });
});

describe('formatIncomeStatement', () => {
  test('it formats income statement correctly', () => {
    const incomeStatement = {
      revenues: { total: 150.0001, category1: 50, category2: 100 },
      costOfSales: { total: 10.239232 },
      expenses: { total: 30.2323, category3: 30 },
      profit: { gross: 120, net: 90 },
    };

    const result = formatIncomeStatement(incomeStatement);

    expect(result.revenues.total).toBe(150);
    expect(result.expenses.total).toBe(30.23);
  });
});
