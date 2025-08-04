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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl flex rounded-2xl shadow-2xl shadow-primary/10 bg-card/60 backdrop-blur-lg border border-primary/10"
      >
        <AuthVisual />
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <AuthForm isLogin={isLogin} onToggle={handleToggle} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;