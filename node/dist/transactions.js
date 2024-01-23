"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// In-memory data store
const transactions = [];
exports.default = (app) => {
    app
        .route("/transactions/")
        // Route to list all transactions
        .get((req, res) => {
        res.json(transactions);
    })
        // Route to add a transaction
        .post((req, res) => {
        const { id, date, details, amount, ledger } = req.body;
        const newTransaction = { id, date, details, amount, ledger };
        transactions.push(newTransaction);
        res.status(201).json(newTransaction);
    });
    // Route to view a simple income statement
    app.get("/income-statement", (req, res) => {
        const totalIncome = transactions.reduce((total, transaction) => {
            return transaction.amount > 0 ? total + transaction.amount : total;
        }, 0);
        const totalExpenses = transactions.reduce((total, transaction) => {
            return transaction.amount < 0 ? total + transaction.amount : total;
        }, 0);
        const netIncome = totalIncome + totalExpenses;
        res.json({
            totalIncome,
            totalExpenses,
            netIncome,
        });
    });
};
