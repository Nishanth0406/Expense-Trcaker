
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { useExpenses } from './ExpenseContext';

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [isOverBudget, setIsOverBudget] = useState(false);
  const { user } = useAuth();
  const { transactions } = useExpenses();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const storedBudget = localStorage.getItem(`budget_${user.id}`);
      if (storedBudget) {
        setBudgetLimit(parseFloat(storedBudget));
      }
    }
  }, [user]);

  useEffect(() => {
    if (budgetLimit > 0) {
      const currentMonthExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          const currentDate = new Date();
          return t.type === 'expense' &&
            transactionDate.getMonth() === currentDate.getMonth() &&
            transactionDate.getFullYear() === currentDate.getFullYear();
        })
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      if (currentMonthExpenses > budgetLimit && !isOverBudget) {
        setIsOverBudget(true);
        toast({
          title: "Budget Alert",
          description: "You've exceeded your monthly budget limit!",
          variant: "destructive",
        });
      } else {
        setIsOverBudget(false);
      }
    }
  }, [transactions, budgetLimit]);

  const updateBudgetLimit = (newLimit) => {
    setBudgetLimit(newLimit);
    if (user) {
      localStorage.setItem(`budget_${user.id}`, newLimit.toString());
    }
    toast({
      title: "Budget Updated",
      description: `Your monthly budget limit is now set to ${newLimit}`,
    });
  };

  return (
    <BudgetContext.Provider value={{ budgetLimit, isOverBudget, updateBudgetLimit }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);
