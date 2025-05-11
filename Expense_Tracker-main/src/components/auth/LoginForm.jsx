
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate login API call
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password') {
        login({ 
          id: '1', 
          email, 
          name: 'Demo User',
          avatar: null
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try demo@example.com / password",
          variant: "destructive"
        });
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('password');
    
    setTimeout(() => {
      login({ 
        id: '1', 
        email: 'demo@example.com', 
        name: 'Demo User',
        avatar: null
      });
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a 
            href="#" 
            className="text-sm text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              toast({
                title: "Password Reset",
                description: "This would link to a password reset page in a real app."
              });
            }}
          >
            Forgot password?
          </a>
        </div>
        <Input 
          id="password" 
          type="password" 
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full mt-2"
        onClick={handleDemoLogin}
      >
        Use Demo Account
      </Button>
    </form>
  );
};

export default LoginForm;
