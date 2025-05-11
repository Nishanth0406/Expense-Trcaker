
import { useExpenses } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316', '#FBBF24', '#10B981', '#06B6D4', '#3B82F6', '#A855F7'];

const CategoryBreakdown = ({ transactionType = 'expense' }) => {
  const { getCategoryTotals } = useExpenses();
  const { selectedCurrency } = useAuth();
  
  // Get category totals for the transaction type
  const categoryTotals = getCategoryTotals(transactionType)
    .filter(category => category.total > 0)
    .map((category, index) => ({
      name: category.name,
      value: category.total,
      color: COLORS[index % COLORS.length],
      icon: category.icon
    }));
  
  // Calculate the total amount
  const totalAmount = categoryTotals.reduce((sum, category) => sum + category.value, 0);
  
  // Format tooltip value
  const formatTooltip = (value) => {
    return `${selectedCurrency.symbol}${value.toFixed(2)}`;
  };
  
  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry, index) => {
          const percentage = ((entry.value / totalAmount) * 100).toFixed(1);
          
          return (
            <li key={`item-${index}`} className="flex items-center space-x-2 text-sm">
              <div className="h-3 w-3" style={{ backgroundColor: entry.color }} />
              <span className="flex-1 truncate">{entry.payload.icon} {entry.value}</span>
              <span className="text-muted-foreground">{percentage}%</span>
            </li>
          );
        })}
      </ul>
    );
  };
  
  return (
    <div className="h-[250px] w-full">
      {categoryTotals.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryTotals}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryTotals.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [formatTooltip(value), 'Amount']} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No {transactionType} data available</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;
