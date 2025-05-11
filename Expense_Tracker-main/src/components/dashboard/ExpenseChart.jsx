
import { useState, useEffect } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExpenseChart = ({ transactionType = 'expense' }) => {
  const { transactions } = useExpenses();
  const { selectedCurrency } = useAuth();
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // Filter transactions by type
    const filteredTransactions = transactions.filter(t => t.type === transactionType);
    
    // Get all transaction dates and group by day
    const groupedByDay = filteredTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month + 1}-${day}`;
      
      if (!acc[key]) {
        acc[key] = {
          date: key,
          amount: 0,
          day: day,
          month: month + 1,
          year: year,
          displayDate: `${month + 1}/${day}`
        };
      }
      
      acc[key].amount += parseFloat(transaction.amount);
      return acc;
    }, {});
    
    // Convert grouped data to array and sort by date
    const dataArray = Object.values(groupedByDay)
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    
    // Only show the last 7 days if there are more than 7 days of data
    const last7Days = dataArray.length > 7 
      ? dataArray.slice(Math.max(dataArray.length - 7, 0))
      : dataArray;
    
    setChartData(last7Days);
  }, [transactions, transactionType]);
  
  const formatTooltip = (value) => {
    return `${selectedCurrency.symbol}${value.toFixed(2)}`;
  };
  
  return (
    <div className="h-[300px] w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="displayDate" />
            <YAxis 
              tickFormatter={(value) => `${selectedCurrency.symbol}${value}`} 
              width={60}
            />
            <Tooltip 
              formatter={(value) => [formatTooltip(value), transactionType === 'expense' ? 'Expense' : 'Income']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="amount"
              fill={transactionType === 'expense' ? '#F43F5E' : '#10B981'}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No {transactionType} data available</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
