
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionFilter from '@/components/transactions/TransactionFilter';
import AddTransactionButton from '@/components/transactions/AddTransactionButton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Transactions = () => {
  const { user } = useAuth();
  const { transactions } = useExpenses();
  
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: null,
    endDate: null,
    searchQuery: ''
  });
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Filter transactions based on filters
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by category
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    
    // Filter by date range
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false;
    }
    
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Filter by search query
    if (filters.searchQuery && !transaction.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage your transactions
            </p>
          </div>
          <AddTransactionButton>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </AddTransactionButton>
        </div>
        
        <TransactionFilter filters={filters} setFilters={setFilters} />
        
        <TransactionList 
          transactions={filteredTransactions} 
          showActions={true}
          emptyMessage="No transactions found. Adjust your filters or add a new transaction."
        />
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
