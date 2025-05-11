
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useBudget } from '@/contexts/BudgetContext';
import { Progress } from '@/components/ui/progress';
import { formatAmount } from '@/lib/utils';
import { motion } from 'framer-motion';

const BudgetProgress = () => {
  const { selectedCurrency } = useAuth();
  const { transactions } = useExpenses();
  const { budgetLimit, isOverBudget } = useBudget();

  const currentMonthExpenses = useMemo(() => {
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const currentDate = new Date();
        return t.type === 'expense' &&
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions]);

  const percentage = budgetLimit > 0 ? (currentMonthExpenses / budgetLimit) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Monthly Budget</h3>
        <span className={`text-sm font-medium ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
          {formatAmount(currentMonthExpenses, selectedCurrency)} / {formatAmount(budgetLimit, selectedCurrency)}
        </span>
      </div>
      <Progress value={Math.min(percentage, 100)} className="h-2" />
      <p className="mt-2 text-sm text-muted-foreground">
        {percentage > 100 
          ? `You're ${formatAmount(currentMonthExpenses - budgetLimit, selectedCurrency)} over budget`
          : `${formatAmount(budgetLimit - currentMonthExpenses, selectedCurrency)} remaining`}
      </p>
    </motion.div>
  );
};

export default BudgetProgress;
