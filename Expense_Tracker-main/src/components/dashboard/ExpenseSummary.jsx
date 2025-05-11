
import { useAuth } from '@/contexts/AuthContext';
import { ArrowDownIcon, ArrowUpIcon, ArrowRightLeft } from 'lucide-react';
import { formatAmount } from '@/lib/utils';

const ExpenseSummary = ({ stats }) => {
  const { selectedCurrency } = useAuth();
  
  const cards = [
    {
      title: "Income",
      value: stats.income,
      delta: "+20%",
      deltaType: "increase",
      icon: ArrowDownIcon,
      iconColor: "text-income bg-green-100",
    },
    {
      title: "Expenses",
      value: stats.expenses,
      delta: "+12%",
      deltaType: "increase",
      icon: ArrowUpIcon,
      iconColor: "text-expense bg-red-100",
    },
    {
      title: "Balance",
      value: stats.balance,
      delta: "+8%",
      deltaType: "increase",
      icon: ArrowRightLeft,
      iconColor: "text-primary bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <div key={index} className="dashboard-stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className="mt-1 text-2xl font-semibold">
                {formatAmount(card.value, selectedCurrency)}
              </p>
            </div>
            <div className={`rounded-full p-2 ${card.iconColor}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseSummary;
