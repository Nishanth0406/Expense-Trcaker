
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// TypeScript versions of the utility functions
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatAmount(amount: number, currency: { symbol: string }): string {
  return `${currency.symbol}${amount.toFixed(2)}`;
}

export function groupTransactionsByDate(transactions: any[]): Record<string, any[]> {
  return transactions.reduce((groups: Record<string, any[]>, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
