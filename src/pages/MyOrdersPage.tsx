import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, PackageSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OrderListItem from '@/components/OrderListItem';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const MyOrdersPage = () => {
  const { orders, ordersLoading } = useAuth();
  const navigate = useNavigate();

  const renderContent = () => {
    if (ordersLoading) {
      return (
        <div className="flex items-center justify-center p-8 h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-16 bg-card rounded-lg border-2 border-dashed border-primary/20">
          <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">No Orders Found</h2>
          <p className="mt-2 text-muted-foreground">You haven't placed any orders yet.</p>
          <Button onClick={() => navigate('/browse/mobiles')} className="mt-6">
            Start Shopping
          </Button>
        </div>
      );
    }

    return (
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {orders.map((order) => (
          <OrderListItem key={order.id} order={order} />
        ))}
      </motion.div>
    );
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-primary">My Orders</h1>
        {renderContent()}
      </motion.div>
    </Layout>
  );
};

export default MyOrdersPage;