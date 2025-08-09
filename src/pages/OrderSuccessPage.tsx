import React from 'react';
import Layout from '@/components/Layout';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="flex flex-col items-center justify-center text-center min-h-[60vh] bg-card rounded-lg p-8"
      >
        <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-foreground mb-3">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-2">Thank you for your purchase.</p>
        <p className="text-muted-foreground mb-6">
          Your Order ID is: <span className="font-semibold text-primary">{orderId}</span>
        </p>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8 max-w-md">
          <p className="font-bold">Payment Information</p>
          <p>Please keep the exact cash amount ready for delivery. Our agent will not be able to provide change.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/my-orders">
            <Button>View My Orders</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </motion.div>
    </Layout>
  );
};

export default OrderSuccessPage;