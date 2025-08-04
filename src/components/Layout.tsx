import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion, easeInOut } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <motion.main
        className="flex-grow container mx-auto px-4 md:px-6 py-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeInOut }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;