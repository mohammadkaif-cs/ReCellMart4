import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PackageSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderListItem from '@/components/OrderListItem';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const MyOrders = () => {
  const { orders, ordersLoading } = useAuth();
  const navigate = useNavigate();

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="border-dashed border-primary/30 bg-card">
        <CardHeader className="items-center text-center">
          <PackageSearch className="h-12 w-12 text-muted-foreground" />
          <CardTitle>No Orders Found</CardTitle>
          <CardDescription>You haven't placed any orders yet.</CardDescription>
          <Button onClick={() => navigate('/browse/mobiles')} className="mt-4">Start Shopping</Button>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Order History</CardTitle>
        <CardDescription>Here's a list of all your past and current orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MyOrders;