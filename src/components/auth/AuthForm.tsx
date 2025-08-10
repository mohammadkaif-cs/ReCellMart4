import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import GoogleIcon from './GoogleIcon';

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const navigate = useNavigate();
  const { signup, login, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const toastId = toast.loading('Signing in with Google...');
    try {
      await signInWithGoogle();
      toast.dismiss(toastId);
    } catch (error: any) {
      toast.dismiss(toastId);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-2">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 border-[1px]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 border-[1px]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              {isLogin && (
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 border-[1px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3.5 bg-[#3b82f6] hover:bg-blue-700 text-white font-bold rounded-lg"
            disabled={loading || googleLoading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : buttonText}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-3.5 border-gray-300 text-gray-700 font-semibold rounded-lg flex items-center justify-center"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            {toggleText}{' '}
            <button
              type="button"
              onClick={onToggle}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {toggleLinkText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;