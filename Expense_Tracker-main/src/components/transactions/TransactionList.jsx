
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/contexts/ExpenseContext';
import { formatDate, formatAmount } from '@/lib/utils';
import { PlusCircle, MinusCircle, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';
import TransactionForm from './TransactionForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const TransactionList = ({ transactions = [], showActions = true, emptyMessage = "No transactions found." }) => {
  const { selectedCurrency } = useAuth();
  const { deleteTransaction } = useExpenses();
  const [editTransaction, setEditTransaction] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Combined categories for lookup
  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  
  // Function to get category details by id
  const getCategoryById = (categoryId) => {
    return allCategories.find(cat => cat.id === categoryId) || { name: 'Unknown', icon: '❓' };
  };
  
  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (id) => {
    deleteTransaction(id);
  };
  
  // Close dialog and reset transaction
  const closeDialog = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => setEditTransaction(null), 300);
  };
  
  if (!transactions.length) {
    return (
      <div className="text-center py-10 border rounded-md bg-card">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className={`expense-card ${transaction.type === 'income' ? 'income' : 'expense'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                  {transaction.type === 'income' 
                    ? <PlusCircle className="h-6 w-6 text-income" />
                    : <MinusCircle className="h-6 w-6 text-expense" />
                  }
                </div>
                
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">{getCategoryById(transaction.category).icon} {getCategoryById(transaction.category).name}</span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <p className={`font-medium text-right ${transaction.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  {transaction.type === 'income' ? '+ ' : '- '}
                  {formatAmount(transaction.amount, selectedCurrency)}
                </p>
                
                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the 
                              transaction "{transaction.description}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(transaction.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editTransaction && (
            <TransactionForm 
              transaction={editTransaction} 
              onComplete={closeDialog} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionList;
