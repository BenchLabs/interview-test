import bodyParser from 'body-parser';
import * as dateFns from 'date-fns';
import express, { Express } from 'express';
import request from 'supertest';
import transactionStore, { Transaction } from './transactionStore';
import transactionsRoute from './transactions';

describe('Transactions Route', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    transactionsRoute(app);
  });

  test('GET /transactions returns a list of transactions with formatted dates', async () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date('2024-01-01'),
        details: 'Transaction 1',
        amount: 50,
        ledger: 'income',
      },
    ];

    jest.spyOn(transactionStore.getInstance(), 'getTransactions').mockReturnValue(mockTransactions);

    const response = await request(app).get('/transactions/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      mockTransactions.map((t) => ({ ...t, date: dateFns.formatISO(t.date) })),
    );
  });

  test('POST /transactions adds a new transaction and returns the created transaction', async () => {
    const newTransaction = {
      id: '2',
      date: dateFns.formatISO(new Date()),
      details: 'New Transaction',
      amount: 75,
      ledger: 'Rent or Lease',
    };

    const response = await request(app).post('/transactions/').send(newTransaction);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newTransaction);
  });
});
