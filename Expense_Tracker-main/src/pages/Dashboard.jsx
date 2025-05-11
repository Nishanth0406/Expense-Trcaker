import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionList from '@/components/transactions/TransactionList';
import ExpenseSummary from '@/components/dashboard/ExpenseSummary';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import BudgetProgress from '@/components/dashboard/BudgetProgress';
import BudgetSettings from '@/components/dashboard/BudgetSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, loading, getTransactionStats } = useExpenses();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const stats = getTransactionStats();
  const recentTransactions = transactions.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="flex flex-col space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">
                Here's your financial summary and recent activity
              </p>
            </div>
            <BudgetSettings />
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <BudgetProgress />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ExpenseSummary stats={stats} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Expense Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="expenses">
                  <TabsList className="mb-4">
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                  </TabsList>
                  <TabsContent value="expenses" className="pt-2">
                    <ExpenseChart transactionType="expense" />
                  </TabsContent>
                  <TabsContent value="income" className="pt-2">
                    <ExpenseChart transactionType="income" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="expenses">
                  <TabsList className="mb-4">
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                  </TabsList>
                  <TabsContent value="expenses" className="space-y-4 pt-2">
                    <CategoryBreakdown transactionType="expense" />
                  </TabsContent>
                  <TabsContent value="income" className="space-y-4 pt-2">
                    <CategoryBreakdown transactionType="income" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList 
                  transactions={recentTransactions} 
                  showActions={false}
                />
                <div className="mt-4 text-center">
                  <a href="/transactions" className="text-sm text-primary hover:underline">
                    View all transactions
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
