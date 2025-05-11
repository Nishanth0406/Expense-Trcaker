
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";

const ExpenseContext = createContext();

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'housing', name: 'Housing', icon: '🏠' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'health', name: 'Healthcare', icon: '⚕️' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'other', name: 'Other', icon: '📝' }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: '💰' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'investment', name: 'Investment', icon: '📈' },
  { id: 'gift', name: 'Gift', icon: '🎁' },
  { id: 'other', name: 'Other', icon: '📝' }
];

export function ExpenseProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Load transactions from local storage
      const storedTransactions = localStorage.getItem(`transactions_${user.id}`);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        // Set demo data if no transactions
        const demoTransactions = generateDemoTransactions();
        setTransactions(demoTransactions);
        saveTransactionsToStorage(demoTransactions);
      }
    } else {
      setTransactions([]);
    }
    setLoading(false);
  }, [user]);

  const saveTransactionsToStorage = (updatedTransactions) => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(updatedTransactions));
    }
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      date: transaction.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactionsToStorage(updatedTransactions);
    
    toast({
      title: `${transaction.type === 'income' ? 'Income' : 'Expense'} Added`,
      description: `${transaction.description} has been added successfully.`,
    });
    
    return newTransaction;
  };

  const updateTransaction = (id, updatedData) => {
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...updatedData } : transaction
    );
    setTransactions(updatedTransactions);
    saveTransactionsToStorage(updatedTransactions);
    
    toast({
      title: "Transaction Updated",
      description: "Your transaction has been updated successfully.",
    });
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    saveTransactionsToStorage(updatedTransactions);
    
    toast({
      title: "Transaction Deleted",
      description: "Your transaction has been deleted successfully.",
    });
  };

  const getTransactionStats = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
    return {
      income,
      expenses,
      balance: income - expenses
    };
  };

  const getCategoryTotals = (transactionType = 'expense') => {
    const filteredTransactions = transactions.filter(t => t.type === transactionType);
    
    const categories = transactionType === 'expense' 
      ? EXPENSE_CATEGORIES 
      : INCOME_CATEGORIES;
    
    return categories.map(category => {
      const total = filteredTransactions
        .filter(t => t.category === category.id)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
      return {
        ...category,
        total
      };
    }).sort((a, b) => b.total - a.total);
  };

  function generateDemoTransactions() {
    // Current date for reference
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Helper to create a date within the current month
    const dateInCurrentMonth = (day) => {
      return new Date(currentYear, currentMonth, day).toISOString();
    };
    
    return [
      {
        id: '1',
        type: 'income',
        amount: 3000,
        description: 'Monthly Salary',
        category: 'salary',
        date: dateInCurrentMonth(1),
        createdAt: dateInCurrentMonth(1)
      },
      {
        id: '2',
        type: 'expense',
        amount: 800,
        description: 'Apartment Rent',
        category: 'housing',
        date: dateInCurrentMonth(3),
        createdAt: dateInCurrentMonth(3)
      },
      {
        id: '3',
        type: 'expense',
        amount: 120,
        description: 'Grocery Shopping',
        category: 'food',
        date: dateInCurrentMonth(5),
        createdAt: dateInCurrentMonth(5)
      },
      {
        id: '4',
        type: 'expense',
        amount: 45,
        description: 'Netflix Subscription',
        category: 'entertainment',
        date: dateInCurrentMonth(7),
        createdAt: dateInCurrentMonth(7)
      },
      {
        id: '5',
        type: 'income',
        amount: 500,
        description: 'Freelance Project',
        category: 'business',
        date: dateInCurrentMonth(10),
        createdAt: dateInCurrentMonth(10)
      },
      {
        id: '6',
        type: 'expense',
        amount: 35,
        description: 'Gas',
        category: 'transport',
        date: dateInCurrentMonth(12),
        createdAt: dateInCurrentMonth(12)
      },
      {
        id: '7',
        type: 'expense',
        amount: 200,
        description: 'New Headphones',
        category: 'shopping',
        date: dateInCurrentMonth(15),
        createdAt: dateInCurrentMonth(15)
      },
      {
        id: '8',
        type: 'expense',
        amount: 60,
        description: 'Electric Bill',
        category: 'utilities',
        date: dateInCurrentMonth(18),
        createdAt: dateInCurrentMonth(18)
      }
    ];
  }

  return (
    <ExpenseContext.Provider 
      value={{ 
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionStats,
        getCategoryTotals,
        EXPENSE_CATEGORIES,
        INCOME_CATEGORIES
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
