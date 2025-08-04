import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
  const { currentUser } = useAuth();

  const navLinks = currentUser ? [
    { name: 'Home', href: '/' },
    { name: 'Mobiles', href: '/browse/mobiles' },
    { name: 'Laptops', href: '/browse/laptops' },
    { name: 'Dashboard', href: '/dashboard' },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'Login', href: '/login' },
    { name: 'Sign Up', href: '/signup' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full bg-card border-t border-border"
    >
      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold text-primary mb-4">ReCellMart</h3>
        
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          {navLinks.map(link => (
            <Link key={link.name} to={link.href} className="text-muted-foreground hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>
          <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></a>
          <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></a>
        </div>

        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} ReCellMart. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;