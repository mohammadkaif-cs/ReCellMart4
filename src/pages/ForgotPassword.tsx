import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-8"
      >
        {submitted ? (
          <div className="text-center">
            <Mail className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Check your email</h1>
            <p className="text-gray-500 mt-2">
              If an account with <span className="font-medium text-gray-700">{email}</span> exists, you will receive an email with instructions to reset your password.
            </p>
            <Link to="/login">
              <Button className="mt-6 w-full py-3.5 bg-[#3b82f6] hover:bg-blue-700 text-white font-bold rounded-lg">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Forgot Password?</h1>
              <p className="text-gray-500 mt-2">No worries, we'll send you reset instructions.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3.5 bg-[#3b82f6] hover:bg-blue-700 text-white font-bold rounded-lg"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
              </Button>
              <div className="text-center text-sm text-gray-500 mt-4">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Back to Sign In
                </Link>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;