import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { loading, loadingProfile } = useAuth();

  if (loading || loadingProfile) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section className="relative text-center min-h-[80vh] flex items-center justify-center rounded-lg overflow-hidden bg-card border border-border">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop')" }}
          ></div>
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="relative container mx-auto px-4">
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeInOut, delay: 0.2 }}
            >
              Mobile & Laptop Picks, Verified for You.
            </motion.h1>
            <motion.p
              className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeInOut, delay: 0.2 }}
            >
              Discover certified, high-quality second-hand mobiles and laptops. Every device is verified for your peace of mind.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: easeInOut, delay: 0.4 }}
              whileHover={{ scale: 1.04 }}
            >
              <Link to="/browse/mobiles">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-shadow transition-all duration-300 text-lg px-8 py-6 rounded-full"
                >
                  Explore Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Other sections can be added here using the new theme */}
      </div>
    </Layout>
  );
};

export default Index;