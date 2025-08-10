import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const title = isLogin ? 'Welcome Back' : 'Create Your Account';
  const description = isLogin ? 'Sign in to continue to ReCellMart.' : 'Get started with your new account.';
  const buttonText = isLogin ? 'Sign In' : 'Create Account';
  const toggleText = isLogin ? "Don't have an account?" : 'Already have an account?';
  const toggleLinkText = isLogin ? 'Sign Up' : 'Sign In';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    const toastId = toast.loading(isLogin ? 'Signing in...' : 'Creating account...');

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Signed in successfully!', { id: toastId });
      } else {
        await signup(email, password, name);
        toast.success('Account created successfully!', { id: toastId });
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="your@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {!isLogin && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1 text-primary" />
              Password must be at least 6 characters
            </p>
          )}
        </div>

        <Button type="submit" className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-shadow transition-all duration-300" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : buttonText}
        </Button>

        <div className="text-center text-sm text-muted-foreground pt-4">
          {toggleText}{' '}
          <button type="button" onClick={onToggle} className="font-medium text-primary hover:underline">
            {toggleLinkText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;