
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const CurrencySelector = () => {
  const { currencies, selectedCurrency, changeCurrency } = useAuth();
  
  const handleCurrencyChange = (value) => {
    const currency = currencies.find(c => c.code === value);
    if (currency) {
      changeCurrency(currency);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="currency-select">Currency</Label>
      <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger id="currency-select">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code} - {currency.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
