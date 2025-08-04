import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';

const AuthVisual = () => {
  return (
    <div className="relative hidden h-full w-full items-center justify-center overflow-hidden rounded-l-2xl bg-primary/5 lg:flex">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20" />
      
      <motion.div 
        className="relative z-10 text-center text-primary-foreground p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold text-primary">ReCellMart</h2>
        <p className="mt-2 text-lg text-primary/80">Secure, Verified, Yours.</p>
      </motion.div>

      {/* Floating Icons */}
      <motion.div
        className="absolute"
        style={{ top: '15%', left: '20%' }}
        animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <Lock className="h-12 w-12 text-primary/30" />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ bottom: '20%', right: '15%' }}
        animate={{ y: [5, -5, 5], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.5 }}
      >
        <ShieldCheck className="h-16 w-16 text-primary/40" />
      </motion.div>
      <motion.div
        className="absolute"
        style={{ top: '50%', left: '10%' }}
        animate={{ y: [-3, 3, -3], rotate: [5, -5, 5] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }}
      >
        <KeyRound className="h-8 w-8 text-primary/20" />
      </motion.div>
    </div>
  );
};

export default AuthVisual;