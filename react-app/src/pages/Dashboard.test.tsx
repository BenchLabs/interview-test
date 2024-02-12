/* eslint-disable testing-library/no-unnecessary-act */
import { fireEvent, render, screen } from '@testing-library/react';
import { format, startOfYear } from 'date-fns';
import { Transaction } from '../hooks/useTransactionStore';
import Dashboard, { createIncomeStatement, formatIncomeStatementData } from './Dashboard';

describe('Dashboard Component', () => {
  describe('createIncomeStatement', () => {
    test('calculates income statement correctly', () => {
      const transactions: Transaction[] = [
        { id: '1', category: 'Sales Revenue', amount: 100, date: new Date(), details: 'Test' },
        {
          id: '2',
          category: 'Cost of Goods Sold',
          amount: 50,
          date: new Date(),
          details: 'Test 2',
        },
        {
          id: '3',
          category: 'Bank & Merchant Fees',
          amount: 10,
          date: new Date(),
          details: 'Test 3',
        },
      ];

      const dateRange = { start: new Date(), end: new Date() };
      const result = createIncomeStatement(transactions, dateRange);

      expect(result.revenues.total).toBe(100);
      expect(result.costOfSales.total).toBe(50);
      expect(result.expenses.total).toBe(10);
      expect(result.profit.gross).toBe(50);
      expect(result.profit.net).toBe(40);
    });

    // Add more test cases based on your specific requirements
  });

  describe('formatIncomeStatementData', () => {
    test('formats positive data correctly', () => {
      const result = formatIncomeStatementData(50);
      expect(result).toBe('50.00');
    });

    test('formats negative data correctly', () => {
      const result = formatIncomeStatementData(-30);
      expect(result).toBe('(30.00)');
    });

    test('handles zero data correctly', () => {
      const result = formatIncomeStatementData(0);
      expect(result).toBe('-');
    });
  });

  test('renders Dashboard component with initial data', () => {
    render(<Dashboard />);
    // You can add more specific assertions based on your UI structure
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Gross Profit')).toBeInTheDocument();
    expect(screen.getByText('Net Profit')).toBeInTheDocument();
  });

  test('updates date range when date pickers are changed', () => {
    render(<Dashboard />);
    const startDatePicker = screen.getByLabelText('Start Date');
    const endDatePicker = screen.getByLabelText('End Date');

    // Change the date range to this year up to today
    fireEvent.change(startDatePicker, {
      target: { value: format(startOfYear(new Date()), 'MM/dd/yyyy') },
    });
    fireEvent.change(endDatePicker, {
      target: {
        value: format(new Date(), 'MM/dd/yyyy'),
      },
    });

    expect(startDatePicker).toHaveValue('01/01/2024');
    expect(endDatePicker).toHaveValue('01/22/2024');
  });

  test('displays correct data in the income statement table', () => {
    render(<Dashboard />);
    // Add more assertions based on your specific UI structure and data
    expect(screen.getByText('Sales Revenue')).toBeInTheDocument();
    expect(screen.getByText('Cost of Goods Sold')).toBeInTheDocument();
    expect(screen.getByText('Bank & Merchant Fees')).toBeInTheDocument();
  });
});
