import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from '@/components/auth/AuthForm';
import AuthVisual from '@/components/auth/AuthVisual';
import AnimatedBackground from '@/components/auth/AnimatedBackground';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === '/login';

  const handleToggle = () => {
    if (isLogin) {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Column - Gradient Background */}
      <div className="hidden lg:flex w-1/2 min-h-screen bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] items-center justify-center p-8">
        <div className="max-w-md text-center text-white">
          <div className="mb-8">
            <img
              src="/recellmart_logo.png"
              alt="ReCellMart Logo"
              className="h-16 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Welcome to ReCellMart</h2>
            <p className="opacity-80">Premium Refurbished Electronics Marketplace</p>
          </div>
          <div className="space-y-4 mt-12">
            <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
              Certified Quality Products
            </button>
            <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
              Eco-Friendly Choice
            </button>
            <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
              1-Day Delivery
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6">
        <motion.div
          key={isLogin ? 'login' : 'signup'}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full max-w-md"
        >
          <AuthForm isLogin={isLogin} onToggle={handleToggle} />
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;