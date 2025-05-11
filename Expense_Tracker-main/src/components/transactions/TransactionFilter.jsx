
import { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const TransactionFilter = ({ filters, setFilters }) => {
  const { EXPENSE_CATEGORIES, INCOME_CATEGORIES } = useExpenses();
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Combined categories for filter
  const allCategories = [
    { id: 'all', name: 'All Categories' },
    ...EXPENSE_CATEGORIES,
    ...INCOME_CATEGORIES
  ];

  // Handle date range selection
  const handleDateSelect = (date) => {
    if (!filters.startDate || (filters.startDate && filters.endDate)) {
      // If no start date or both dates are already set, set start date
      setFilters({ ...filters, startDate: date, endDate: null });
    } else {
      // If start date is set but no end date, set end date
      if (date < new Date(filters.startDate)) {
        // If selected date is before start date, swap them
        setFilters({ ...filters, startDate: date, endDate: new Date(filters.startDate) });
      } else {
        setFilters({ ...filters, endDate: date });
      }
      setCalendarOpen(false);
    }
  };

  // Clear date filters
  const clearDateFilter = () => {
    setFilters({ ...filters, startDate: null, endDate: null });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      startDate: null,
      endDate: null,
      searchQuery: ''
    });
  };

  return (
    <div className="rounded-md border p-4 space-y-4">
      {/* Search and Type Filter */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search transactions..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category and Date Range Filter */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="w-full sm:w-40">
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.id !== 'all' && `${category.icon} `}{category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? (
                  filters.endDate ? (
                    <>
                      {format(new Date(filters.startDate), "PPP")} -{" "}
                      {format(new Date(filters.endDate), "PPP")}
                    </>
                  ) : (
                    format(new Date(filters.startDate), "PPP")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
              {(filters.startDate || filters.endDate) && (
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                    <X className="mr-2 h-4 w-4" />
                    Clear date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear all filters
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilter;
