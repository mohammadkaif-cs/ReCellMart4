import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

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

  const title = isLogin ? 'Welcome Back' : 'Create Account';
  const description = isLogin ? 'Sign in to access your account.' : 'Get started with ReCellMart.';
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
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} className="h-12 text-base" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-primary"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {!isLogin && <p className="text-xs text-muted-foreground">Password must be at least 6 characters.</p>}
        </div>
        <Button type="submit" className="w-full h-12 text-base font-semibold mt-4 transition-transform active:scale-[0.98]" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : buttonText}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        {toggleText}{' '}
        <button onClick={onToggle} className="font-semibold text-primary hover:underline focus:outline-none">
          {toggleLinkText}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;