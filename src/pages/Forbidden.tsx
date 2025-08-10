import React from 'react';
import { Link } from 'react-router-dom';
import { motion, easeInOut } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ShieldAlert } from 'lucide-react';

const Forbidden: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <ShieldAlert className="h-24 w-24 text-destructive mb-6" />
        </motion.div>
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight text-destructive"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeInOut }}
        >
          Access Denied
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeInOut, delay: 0.2 }}
        >
          You do not have permission to view this page.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: easeInOut, delay: 0.4 }}
        >
          <Link to="/">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-shadow transition-all duration-300 text-lg px-8 py-6 rounded-full"
            >
              Return to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Forbidden;