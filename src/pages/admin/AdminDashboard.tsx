import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, IndianRupee } from 'lucide-react';
import { db } from '@/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { toast } from 'sonner';
import { Order } from '@/types/order';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribes = [
      onSnapshot(query(collection(db, 'users')), (snapshot) => {
        setStats(prev => ({ ...prev, users: snapshot.size }));
      }, (error) => {
        console.error("Error fetching user count:", error);
        toast.error("Failed to fetch user count.");
      }),

      onSnapshot(query(collection(db, 'products')), (snapshot) => {
        setStats(prev => ({ ...prev, products: snapshot.size }));
      }, (error) => {
        console.error("Error fetching product count:", error);
        toast.error("Failed to fetch product count.");
      }),

      onSnapshot(query(collection(db, 'orders'), where('status', '==', 'Delivered')), (snapshot) => {
        const totalRevenue = snapshot.docs
          .map(doc => doc.data() as Order)
          .reduce((sum, order) => sum + order.totalPrice, 0);
        setStats(prev => ({ ...prev, revenue: totalRevenue }));
      }, (error) => {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch revenue data.");
      }),
    ];

    // A simple way to handle initial loading
    const loadingTimeout = setTimeout(() => setLoading(false), 2000);

    return () => {
      unsubscribes.forEach(unsub => unsub());
      clearTimeout(loadingTimeout);
    };
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.users.toString(), icon: Users, color: 'text-blue-400' },
    { title: 'Total Products', value: stats.products.toString(), icon: Package, color: 'text-green-400' },
    { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-primary' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-card border-border hover:border-primary transition-colors duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-muted-foreground mt-8">
        Welcome, Admin. Select a category from the sidebar to get started.
      </p>
    </motion.div>
  );
};

export default AdminDashboard;