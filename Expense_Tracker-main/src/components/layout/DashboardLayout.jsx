
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  BarChart, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  CreditCard,
  PiggyBank,
  ChevronDown
} from 'lucide-react';
import CurrencySelector from '../currency/CurrencySelector';

const DashboardLayout = ({ children }) => {
  const { user, logout, selectedCurrency } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home,
      active: location.pathname === '/dashboard'
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: CreditCard,
      active: location.pathname === '/transactions'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      active: location.pathname === '/settings'
    }
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar navigation */}
      <div className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">BudgetFlow</span>
          </Link>
        </div>
        
        <div className="flex-1 px-6 py-4">
          <nav className="flex flex-col space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                  item.active 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t px-6 py-4">
          <div className="mb-4">
            <CurrencySelector />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="md:hidden">
              <div className="flex h-16 items-center border-b">
                <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeMobileMenu}>
                  <PiggyBank className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">BudgetFlow</span>
                </Link>
              </div>
              <nav className="flex flex-col space-y-1 mt-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                      item.active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="border-t mt-4 pt-4">
                <div className="mb-4">
                  <CurrencySelector />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar || ""} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1 flex items-center justify-between md:justify-end">
            <Link to="/dashboard" className="flex items-center space-x-2 md:hidden">
              <PiggyBank className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">BudgetFlow</span>
            </Link>
            
            {/* Currency display for mobile */}
            <div className="md:hidden flex items-center">
              <span className="text-sm font-medium mr-2">
                {selectedCurrency.symbol} ({selectedCurrency.code})
              </span>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
