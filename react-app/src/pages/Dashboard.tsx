import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { endOfQuarter, isWithinInterval, startOfQuarter } from 'date-fns';
import { useState } from 'react';
import categories from '../_mocks_/categories';
import DashboardHeader from '../components/DashboardHeader';
import Page from '../components/Page';
import useTransactionStore, { Transaction } from '../hooks/useTransactionStore';

export function useIncomeStatement() {
  const { transactions } = useTransactionStore();
  const [dateRange, setDateRange] = useState({
    start: startOfQuarter(new Date()),
    end: endOfQuarter(new Date()),
  });

  return {
    incomeStatement: createIncomeStatement(transactions, dateRange),
    dateRange,
    setDateRange,
  };
}

type IncomeStatementData = {
  revenues: { [key: string]: number; total: number };
  costOfSales: { [key: string]: number; total: number };
  expenses: { [key: string]: number; total: number };
  profit: { [key: string]: number; gross: number; net: number };
};

type DateRange = {
  start: Date;
  end: Date;
};

export const createIncomeStatement = (transactions: Transaction[], dateRange: DateRange) => {
  const incomeStatement: IncomeStatementData = {
    revenues: { total: 0 },
    costOfSales: { total: 0 },
    expenses: { total: 0 },
    profit: { gross: 0, net: 0 },
  };
  const filteredTxns = transactions.filter((txn) => isWithinInterval(txn.date, dateRange));

  // Put in filteredTxns arr
  const calcIncomeStatement = (arr: Transaction[]) => {
    arr.forEach((item) => {
      const { ledger } = item;
      const category = ledger as keyof typeof categories;
      const cat = categories[category] ?? {};
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
  };
  calcIncomeStatement(filteredTxns);

  return incomeStatement;
};
export const formatIncomeStatementData = (data: number) =>
  data ? `${data > 0 ? data.toFixed(2) : `(${Math.abs(data).toFixed(2)})`}` : '-';

function IncomeStatement({ incomeStatement }: { incomeStatement: IncomeStatementData }) {
  return (
    <>
      <Card sx={{ width: 3 / 4 }}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Income Statement"
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="left" colSpan={4}>
                    <Typography variant="subtitle1">Revenues</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Sales Revenue</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.revenues['Sales Revenue'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Service Revenue</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.revenues['Service Revenue'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Returns & Chargebacks</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.revenues['Returns & Chargebacks'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Interest Income</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.revenues['Interest Income'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Other Income</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.revenues['Other Income'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={3}>
                    <Typography variant="subtitle1">Total Revenue</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.revenues.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={4}>
                    <Typography variant="subtitle1">Cost of Sales</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Cost of Goods Sold</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.costOfSales['Cost of Goods Sold'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Cost of Service</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.costOfSales['Cost of Service'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={3}>
                    <Typography variant="subtitle1">Total Cost of Sales</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.costOfSales.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={4}>
                    <Typography variant="subtitle1">Expenses</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Bank & Merchant Fees</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Bank & Merchant Fees'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Business Meals</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Business Meals'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Client Entertainment</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Client Entertainment'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Computers or Equipment</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(
                        incomeStatement.expenses['Computers or Equipment'],
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Gas & Auto</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Gas & Auto'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Independent Contractor</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(
                        incomeStatement.expenses['Independent Contractor'],
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Insurance Payments</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Insurance Payments'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Interest Paid</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Interest Paid'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Lawyers & Accountants</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Lawyers & Accountants'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Licenses or Fees</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Licenses or Fees'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Marketing or Advertising</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(
                        incomeStatement.expenses['Marketing or Advertising'],
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Miscellaneous Expenses</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(
                        incomeStatement.expenses['Miscellaneous Expenses'],
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Phone, Internet & Utilities</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(
                        incomeStatement.expenses['Phone, Internet & Utilities'],
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Postage & Shipping</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Postage & Shipping'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Rent or Lease</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Rent or Lease'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Software & Hosting</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Software & Hosting'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Supplies</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses.Supplies)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Taxes Paid</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses['Taxes Paid'])}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ maxWidth: 100 }} />
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">Travel & Transportation</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(
                        incomeStatement.expenses['Travel & Transportation'],
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left" colSpan={3}>
                    <Typography variant="subtitle1">Total Expenses</Typography>
                  </TableCell>
                  <TableCell align="left" colSpan={1}>
                    <Typography variant="body2">
                      {formatIncomeStatementData(incomeStatement.expenses.total)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}

function DatePickers({
  dateRange,
  setDateRange,
}: {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}) {
  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={{ width: 3 / 4, border: 0, marginBottom: 4 }}>
      <Grid item>
        <DatePicker
          label="Start Date"
          value={dateRange.start}
          onChange={(date) => setDateRange((prev: DateRange) => ({ ...prev, start: date as Date }))}
        />
      </Grid>
      <Grid item>
        <DatePicker
          label="End Date"
          value={dateRange.end}
          onChange={(date) => setDateRange((prev: DateRange) => ({ ...prev, end: date as Date }))}
        />
      </Grid>
    </Grid>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Grid item sm>
      <Card>
        <CardHeader title={title} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>{formatIncomeStatementData(value)}</CardContent>
      </Card>
    </Grid>
  );
}

function Totals({ incomeStatement }: { incomeStatement: IncomeStatementData }) {
  return (
    <Grid container spacing={2} sx={{ width: 3 / 4, marginBottom: 4 }}>
      <StatCard title="Gross Profit" value={incomeStatement.profit.gross} />
      <StatCard title="Net Profit" value={incomeStatement.profit.net} />
      <StatCard title="Total Revenue" value={incomeStatement.revenues.total} />
      <StatCard title="Outgoings Total" value={incomeStatement.expenses.total} />
    </Grid>
  );
}

function Dashboard() {
  const { incomeStatement, dateRange, setDateRange } = useIncomeStatement();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Page title="Dashboard">
        <Container>
          <h1>Dashboard</h1>
          <DashboardHeader />
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DatePickers dateRange={dateRange} setDateRange={setDateRange} />
            <Totals incomeStatement={incomeStatement} />
            <IncomeStatement incomeStatement={incomeStatement} />
          </Box>
        </Container>
      </Page>
    </LocalizationProvider>
  );
}

export default Dashboard;
