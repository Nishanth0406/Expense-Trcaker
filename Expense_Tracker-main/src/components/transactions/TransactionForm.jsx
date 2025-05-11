
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const TransactionForm = ({ transaction = null, onComplete }) => {
  const { selectedCurrency } = useAuth();
  const { addTransaction, updateTransaction } = useExpenses();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    amount: transaction?.amount || '',
    description: transaction?.description || '',
    category: transaction?.category || '',
    date: transaction?.date ? new Date(transaction.date) : new Date(),
  });
  
  // State for form validation
  const [errors, setErrors] = useState({});
  
  // Get categories based on transaction type
  const categories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  
  useEffect(() => {
    // Reset category when changing transaction type
    if (!transaction) {
      setFormData(data => ({
        ...data,
        category: ''
      }));
    }
  }, [formData.type, transaction]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: formData.date.toISOString()
    };
    
    if (transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    setIsSubmitting(false);
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label>Transaction Type</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          className="flex"
        >
          <div className="flex items-center space-x-2 mr-4">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income" className="cursor-pointer">Income</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="What was this for?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({selectedCurrency.symbol})</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className={errors.amount ? "border-destructive" : ""}
        />
        {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date}
              onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onComplete}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : transaction ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
