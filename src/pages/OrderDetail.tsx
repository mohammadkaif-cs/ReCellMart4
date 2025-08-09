import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { db } from '@/firebase';
import { Order } from '@/types/order';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, IndianRupee, Calendar, MapPin, Phone, User as UserIcon, Hash, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { getStatusClass } from '@/utils/orderUtils';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder({ id: orderSnap.id, ...orderSnap.data() } as Order);
        } else {
          console.error("No such order!");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-destructive">Order Not Found</h1>
          <p className="text-muted-foreground">The requested order could not be found.</p>
        </div>
      </Layout>
    );
  }
  
  const fullAddress = [
    order.deliveryAddress?.street,
    order.deliveryAddress?.city,
    order.deliveryAddress?.pincode,
  ].filter(Boolean).join(', ');

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto bg-card border-primary/20 glow-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-primary mb-1">Order Details</CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Hash className="h-3 w-3" /> {order.id}
                </p>
              </div>
              <Badge variant="outline" className={cn('font-semibold text-base', getStatusClass(order.status))}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary/50 space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Package className="h-5 w-5 text-primary" />
                Order Items
              </h3>
              <ul className="space-y-2">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.productTitle}</span>
                    <span className="font-medium text-foreground">₹{item.price.toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Delivery Information</h4>
                 <p className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="h-4 w-4 text-primary/80" />
                  <span>{order.deliveryAddress?.fullName || 'N/A'}</span>
                </p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/80 mt-1" />
                  <span>{fullAddress || 'Address not available'}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary/80" />
                  <span>{order.userPhone}</span>
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Other Details</h4>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary/80" />
                  <span>Ordered on: {order.orderDate ? new Date(order.orderDate.seconds * 1000).toLocaleString() : '...'}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4 text-primary/80" />
                  <span>Payment: {order.paymentMethod}</span>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/30 p-4 rounded-b-lg">
            <div className="w-full flex justify-between items-center">
              <span className="text-lg font-bold text-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default OrderDetail;