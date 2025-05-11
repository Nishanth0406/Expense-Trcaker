
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBudget } from '@/contexts/BudgetContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';

const BudgetSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const { selectedCurrency } = useAuth();
  const { budgetLimit, updateBudgetLimit } = useBudget();

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(newBudget);
    if (!isNaN(amount) && amount > 0) {
      updateBudgetLimit(amount);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Monthly Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="budget" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Budget Amount ({selectedCurrency.symbol})
            </label>
            <Input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder={budgetLimit.toString()}
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">
            Save Budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetSettings;
