import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyOrders from '@/components/dashboard/MyOrders';
import MyProfile from '@/components/dashboard/MyProfile';
import { ShoppingCart, User, LifeBuoy } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import MySupportTickets from '@/components/dashboard/MySupportTickets';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-extrabold text-primary">User Dashboard</h1>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-primary/20 h-12">
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-shadow h-full">
              <ShoppingCart className="mr-2 h-5 w-5" /> My Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-shadow h-full">
              <User className="mr-2 h-5 w-5" /> My Profile
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:glow-shadow h-full">
              <LifeBuoy className="mr-2 h-5 w-5" /> Support Tickets
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-6">
            <MyOrders />
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <MyProfile />
          </TabsContent>
          <TabsContent value="support" className="mt-6">
            <MySupportTickets />
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;