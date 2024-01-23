import * as dateFns from 'date-fns';
import { Express, Request, Response } from 'express';
import transactionStore, { Transaction } from './transactionStore';

export default (app: Express) => {
  const transactionsList = transactionStore.getInstance();

  app
    .route('/transactions/')

    // Route to list all transactions
    .get((req: Request, res: Response) => {
      res.json(
        transactionsList.getTransactions().map((t) => ({ ...t, date: dateFns.formatISO(t.date) })),
      );
    })
    // Route to add a transaction
    .post((req: Request, res: Response) => {
      const { id, date, details, amount, ledger } = req.body;
      const newTransaction: Transaction = {
        id,
        date: dateFns.parseISO(date),
        details,
        amount,
        ledger,
      };
      transactionsList.saveTransaction(newTransaction);
      res.status(201).json({
        ...newTransaction,
        date: dateFns.formatISO(newTransaction.date),
      });
    });
};
