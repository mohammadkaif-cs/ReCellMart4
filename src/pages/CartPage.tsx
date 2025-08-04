import React, { useMemo } from 'react';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Loader2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import CartItemCard from '@/components/cart/CartItemCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CartPage: React.FC = () => {
  const { cart, cartLoading } = useAuth();

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  if (cartLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-primary">My Cart</h1>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-card rounded-lg border-2 border-dashed border-primary/20 p-8">
            <ShoppingCart className="w-20 h-20 text-primary/50 mb-6" />
            <h3 className="text-2xl font-semibold text-foreground">Your cart is empty</h3>
            <p className="text-muted-foreground mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/browse/mobiles">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-shadow hover-glow">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map(item => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-card border-primary/20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="flex items-center"><IndianRupee className="h-4 w-4" />{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">FREE</span>
                  </div>
                  <div className="border-t border-primary/20 my-2"></div>
                  <div className="flex justify-between font-bold text-lg text-foreground">
                    <span>Total</span>
                    <span className="flex items-center"><IndianRupee className="h-5 w-5" />{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <Link to="/checkout" className="w-full">
                    <Button size="lg" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 glow-shadow hover-glow">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default CartPage;