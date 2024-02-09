/* eslint-disable testing-library/no-unnecessary-act */
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns/format';
import { startOfDay } from 'date-fns/startOfDay';
import useTransactionStore, { Transaction } from '../hooks/useTransactionStore';
import Transactions, { CreateTransaction } from './Transactions';

// Mock the useTransactionStore hook
jest.mock('../hooks/useTransactionStore');

describe('CreateTransaction component', () => {
  test('renders properly with default values', () => {
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();

    render(<CreateTransaction onSave={onSaveMock} onCancel={onCancelMock} open={true} />);

    expect(screen.getByText('Add a New Transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toHaveValue(format(startOfDay(new Date()), 'yyyy-MM-dd'));
    expect(screen.getByLabelText('Company')).toHaveValue('');
    expect(screen.getByLabelText('Amount')).toHaveValue(0);
  });

  test('updates state when input values change', async () => {
    // TODO: test the category dropdown
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();

    render(<CreateTransaction onSave={onSaveMock} onCancel={onCancelMock} open={true} />);

    const dateInput = screen.getByLabelText('Date');
    const companyInput = screen.getByLabelText('Company');
    const amountInput = screen.getByLabelText('Amount');

    await act(async () => {
      userEvent.type(dateInput, '2022-01-01');
      userEvent.type(companyInput, 'Test Company');
      userEvent.type(amountInput, '100');
    });

    expect(dateInput).toHaveValue('2022-01-01');
    expect(companyInput).toHaveValue('Test Company');
    expect(amountInput).toHaveValue(100);
  });

  test('calls onCancel when "Cancel" button is clicked', async () => {
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();

    render(<CreateTransaction onSave={onSaveMock} onCancel={onCancelMock} open={true} />);

    const cancelButton = screen.getByText('Cancel');

    await act(async () => {
      userEvent.click(cancelButton);
    });

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  test('calls onSave with correct data when "Add" button is clicked', async () => {
    const onSaveMock = jest.fn();
    const onCancelMock = jest.fn();

    render(<CreateTransaction onSave={onSaveMock} onCancel={onCancelMock} open={true} />);

    const dateInput = screen.getByLabelText('Date');
    const companyInput = screen.getByLabelText('Company');
    const amountInput = screen.getByLabelText('Amount');
    const addButton = screen.getByRole('button', { name: 'Add' });

    await act(async () => {
      userEvent.type(dateInput, '2022-01-01');
      userEvent.type(companyInput, 'Test Company');
      userEvent.type(amountInput, '100');
      userEvent.click(addButton);
    });

    expect(onSaveMock).toHaveBeenCalledTimes(1);
    expect(onSaveMock).toHaveBeenCalledWith({
      id: expect.any(String),
      date: expect.any(Date),
      details: 'Test Company',
      category: '', // TODO: test category
      amount: 100,
    });
  });
});

describe('Transactions component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading indicator when transactions are loading', () => {
    (useTransactionStore as jest.Mock).mockReturnValue({ transactions: [], loading: true });
    render(<Transactions />);

    // Ensure loading indicator is rendered
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  test('renders transactions when transactions are available', async () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date('2022-01-01'),
        details: 'Company A',
        category: 'Income',
        amount: 100,
      },
      {
        id: '2',
        date: new Date('2022-01-02'),
        details: 'Company B',
        category: 'Expense',
        amount: -50,
      },
    ];

    (useTransactionStore as jest.Mock).mockReturnValue({
      transactions: mockTransactions,
      loading: false,
    });
    render(<Transactions />);

    // Ensure transactions are rendered
    await waitFor(() => {
      expect(screen.getByText('Company A')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Company B')).toBeInTheDocument();
    });
  });

  test('renders no transactions message when transactions array is empty', () => {
    (useTransactionStore as jest.Mock).mockReturnValue({ transactions: [], loading: false });
    render(<Transactions />);

    // Ensure no transactions message is rendered
    expect(screen.getByText('No transactions available')).toBeInTheDocument();
  });

  test('renders formatted amount with correct currency symbols', async () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date('2022-01-01'),
        details: 'Company A',
        category: 'Income',
        amount: 100,
      },
    ];

    (useTransactionStore as jest.Mock).mockReturnValue({
      transactions: mockTransactions,
      loading: false,
    });
    render(<Transactions />);

    // Ensure formatted amount is rendered correctly
    await waitFor(() => {
      const formattedAmount = screen.getByText('$100.00');
      expect(formattedAmount).toBeInTheDocument();
    });
  });
});
