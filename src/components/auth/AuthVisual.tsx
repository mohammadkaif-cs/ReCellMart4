import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';

const AuthVisual = () => {
  return (
    <div className="relative hidden h-full w-full items-center justify-center overflow-hidden rounded-l-2xl lg:flex bg-gradient-to-br from-primary to-[#1e3a8a]">
      <div className="absolute inset-0 bg-[url('/recellmart_logo.png')] bg-contain bg-center bg-no-repeat opacity-10" />
      
      <motion.div
        className="relative z-10 text-center space-y-6 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
        <div className="mx-auto w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
          <Lock className="h-12 w-12 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ReCellMart
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Your trusted marketplace for electronics
          </p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {['Secure', 'Reliable', 'Fast'].map((feature) => (
            <div key={feature} className="bg-white/5 px-3 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium text-white">{feature}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Decorative Elements */}
      {/* Floating bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
          style={{
            width: `${Math.random() * 60 + 20}px`,
            height: `${Math.random() * 60 + 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 50 - 25],
            x: [0, Math.random() * 30 - 15],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: Math.random() * 3
          }}
        />
      ))}
    </div>
  );
};

export default AuthVisual;