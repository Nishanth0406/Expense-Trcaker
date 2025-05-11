
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState({ code: 'USD', symbol: '$', name: 'US Dollar' });
  const { toast } = useToast();

  useEffect(() => {
    // Check if user exists in local storage
    const storedUser = localStorage.getItem('expenseTrackerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check for stored currency preference
    const storedCurrency = localStorage.getItem('selectedCurrency');
    if (storedCurrency) {
      setSelectedCurrency(JSON.parse(storedCurrency));
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    // In a real application, this would validate with a backend
    setUser(userData);
    localStorage.setItem('expenseTrackerUser', JSON.stringify(userData));
    toast({
      title: "Login successful!",
      description: `Welcome back, ${userData.name}!`,
    });
  };

  const register = (userData) => {
    // In a real application, this would register with a backend
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('expenseTrackerUser', JSON.stringify(newUser));
    toast({
      title: "Registration successful!",
      description: "Your account has been created.",
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expenseTrackerUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const changeCurrency = (currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', JSON.stringify(currency));
    toast({
      title: "Currency updated",
      description: `Currency changed to ${currency.name} (${currency.code})`,
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        selectedCurrency, 
        currencies, 
        changeCurrency 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
