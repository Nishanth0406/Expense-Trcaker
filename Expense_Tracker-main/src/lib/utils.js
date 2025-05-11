
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date to readable format
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

// Format amount with currency symbol
export function formatAmount(amount, currency) {
  return `${currency.symbol}${amount.toFixed(2)}`;
}

// Group transactions by date
export function groupTransactionsByDate(transactions) {
  return transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
}

// Format percentage
export function formatPercentage(value) {
  return `${(value * 100).toFixed(1)}%`;
}
