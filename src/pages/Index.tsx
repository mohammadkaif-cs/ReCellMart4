import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Zap, BadgeCheck, ShieldCheck } from 'lucide-react';
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft-lg transition-all duration-300 text-lg px-8 py-6 rounded-full"
                >
                  Explore Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeInOut, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center text-foreground mb-2">Why Choose ReCellMart?</h2>
            <p className="text-center text-muted-foreground mb-12">Your satisfaction is our priority. Here's what we promise.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-card border rounded-lg shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
                <Zap className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">1-Day Delivery</h3>
                <p className="text-muted-foreground">Lightning-fast delivery to get your device in your hands within 24 hours.</p>
              </div>
              <div className="text-center p-6 bg-card border rounded-lg shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
                <BadgeCheck className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Verified Devices</h3>
                <p className="text-muted-foreground">Every product undergoes a rigorous quality check to ensure it meets our high standards.</p>
              </div>
              <div className="text-center p-6 bg-card border rounded-lg shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Assured Warranty</h3>
                <p className="text-muted-foreground">Shop with confidence knowing your purchase is protected by our comprehensive warranty.</p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;