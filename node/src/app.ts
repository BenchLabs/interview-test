import bodyParser from 'body-parser';
import express from 'express';
import incomeStatement from './incomeStatement';
import transactions from './transactions';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

transactions(app);
incomeStatement(app);

export default app;
