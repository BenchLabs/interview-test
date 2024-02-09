import * as dateFns from 'date-fns';
import { Express, Request, Response } from 'express';
import categories from './_mocks_/categories';
import transactionStore, { Transaction } from './transactionStore';

type IncomeStatementData = {
  revenues: { [key: string]: number; total: number };
  costOfSales: { [key: string]: number; total: number };
  expenses: { [key: string]: number; total: number };
  profit: { [key: string]: number; gross: number; net: number };
};

export const calcIncomeStatement = (arr: Transaction[]) => {
  const incomeStatement: IncomeStatementData = {
    revenues: { total: 0 },
    costOfSales: { total: 0 },
    expenses: { total: 0 },
    profit: { gross: 0, net: 0 },
  };

  arr.forEach((item) => {
    const { category } = item;
    const cat = categories[category as keyof typeof categories] ?? {};
    const type = cat.type as keyof typeof incomeStatement;
    const amount = item.amount;

    if (!type) {
      return;
    }

    const grouping = incomeStatement[type];

    grouping[category] ? (grouping[category] += amount) : (grouping[category] = amount);
    if (grouping.total !== undefined) {
      grouping.total += amount;
    }
  });
  const grossProfit = incomeStatement.revenues.total - incomeStatement.costOfSales.total;
  const netProfit = grossProfit - incomeStatement.expenses.total;

  incomeStatement.profit.gross = grossProfit;
  incomeStatement.profit.net = netProfit;
  return incomeStatement;
};

export const formatIncomeStatement = (incomeStatement: IncomeStatementData): any =>
  Object.entries(incomeStatement).reduce((acc, [key, value]) => {
    const formattedValue = Object.entries(value).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: Number(value.toFixed(2)) }),
      {},
    );
    return { ...acc, [key]: formattedValue };
  }, {});

export default (app: Express) => {
  const transactionsList = transactionStore.getInstance();

  // Route to view a simple income statement
  app.get('/income-statement', (req: Request, res: Response) => {
    const { start, end } = req.query;

    const startDate = start
      ? dateFns.parse(String(start), 'yyyy-MM-dd', new Date())
      : dateFns.startOfYear(new Date());
    const endDate = end ? dateFns.parse(String(end), 'yyyy-MM-dd', new Date()) : new Date();

    const transactions = transactionsList.getTransactionsInRange({ startDate, endDate });
    const incomeStatement = calcIncomeStatement(transactions);
    res.json(formatIncomeStatement(incomeStatement));
  });
};
