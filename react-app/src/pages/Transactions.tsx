import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { format, parseISO, startOfDay } from 'date-fns';
import { useState } from 'react';
import categories from '../_mocks_/categories';
import Page from '../components/Page';
import useTransactionStore, { Transaction } from '../hooks/useTransactionStore';

interface CreateTransactionProps {
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
  open: boolean;
}

const categoryList = Object.keys(categories).sort();

export function CreateTransaction({ onSave, onCancel, open }: CreateTransactionProps) {
  const [transactionData, setTransactionData] = useState({
    date: format(startOfDay(new Date()), 'yyyy-MM-dd'),
    details: '',
    ledger: '',
    amount: 0,
  });

  const handleSave = () => {
    onSave({
      ...transactionData,
      id: crypto.randomUUID(),
      date: startOfDay(parseISO(transactionData.date)), // Convert back to Date object
    });
    setTransactionData({
      date: format(startOfDay(new Date()), 'yyyy-MM-dd'),
      details: '',
      ledger: '',
      amount: 0,
    });
  };

  const handleCancel = () => {
    setTransactionData({
      date: format(startOfDay(new Date()), 'yyyy-MM-dd'),
      details: '',
      ledger: '',
      amount: 0,
    });
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Add a New Transaction</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="date"
          value={transactionData.date}
          onChange={(e) => setTransactionData({ ...transactionData, date: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Company"
          value={transactionData.details}
          onChange={(e) => setTransactionData({ ...transactionData, details: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth>
          <InputLabel htmlFor="category-select">Category</InputLabel>
          <Select
            labelId="category-select"
            label="Category"
            value={transactionData.ledger}
            onChange={(e) =>
              setTransactionData({ ...transactionData, ledger: e.target.value as string })
            }>
            {categoryList.map((category: string) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Amount"
          type="number"
          value={transactionData.amount}
          onChange={(e) =>
            setTransactionData({ ...transactionData, amount: parseFloat(e.target.value) })
          }
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: '0' }, // Set minimum value if needed
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Transactions() {
  const { transactions, saveTransaction, loading } = useTransactionStore();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleAddTransaction = () => {
    setIsAddingTransaction(true);
  };

  const handleCancelAddTransaction = () => {
    setIsAddingTransaction(false);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    saveTransaction(transaction);
    setIsAddingTransaction(false);
  };

  return (
    <Page title="Transactions">
      <Container>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <h1>Transactions</h1>
          <Button variant="contained" color="primary" onClick={handleAddTransaction}>
            Add a Transaction
          </Button>
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {loading ? (
            <CircularProgress data-testid="loading-indicator" />
          ) : (
            <Box style={{ width: '100%' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.length <= 0 && (
                      <TableRow key={0}>
                        <TableCell colSpan={4}>
                          <Typography
                            style={{ textAlign: 'center' }}
                            variant="h5"
                            data-testid="empty-message">
                            No transactions available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    {transactions.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell>{format(row.date, 'MM/dd/yyyy')}</TableCell>
                        <TableCell>{row.details}</TableCell>
                        <TableCell>{row.ledger}</TableCell>
                        <TableCell>
                          {(() => {
                            const isNegative = row.amount < 0;
                            const valueFormatted = Math.abs(Math.round(row.amount * 100) / 100)
                              .toFixed(2)
                              .toLocaleString();
                            return isNegative ? `$(${valueFormatted})` : `$${valueFormatted}`;
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
        <CreateTransaction
          open={isAddingTransaction}
          onSave={handleSaveTransaction}
          onCancel={handleCancelAddTransaction}
        />
      </Container>
    </Page>
  );
}

export default Transactions;
