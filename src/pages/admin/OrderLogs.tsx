import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/firebase';
import { collection, onSnapshot, doc, updateDoc, orderBy, query, runTransaction, deleteDoc, getDoc } from 'firebase/firestore';
import { Order } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Loader2, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getStatusClass } from '@/utils/orderUtils';

const OrderLogs = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setAllOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      toast.error("Failed to fetch orders.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      const cityMatch = (order.deliveryAddress?.city ?? '').toLowerCase().includes(cityFilter.toLowerCase());
      const statusMatch = statusFilter === 'All' || order.status === statusFilter;
      return cityMatch && statusMatch;
    });
  }, [allOrders, cityFilter, statusFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    const orderRef = doc(db, 'orders', orderId);
    const toastId = toast.loading(`Updating status to ${newStatus}...`);

    try {
      if (newStatus === 'Cancelled') {
        await runTransaction(db, async (transaction) => {
          const orderDoc = await transaction.get(orderRef);
          if (!orderDoc.exists()) {
            throw new Error("Order not found!");
          }
          const orderData = orderDoc.data() as Order;

          for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.id);
            const productDoc = await transaction.get(productRef);
            if (productDoc.exists()) {
              const newStock = productDoc.data().stock + item.quantity;
              transaction.update(productRef, { stock: newStock });
            }
          }
          
          transaction.update(orderRef, { status: newStatus });
        });
      } else {
        await updateDoc(orderRef, { status: newStatus });
      }
      toast.success(`Order status updated to ${newStatus}.`, { id: toastId });
    } catch (error: any) {
      console.error("Error updating status: ", error);
      toast.error(error.message || "Failed to update order status.", { id: toastId });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const toastId = toast.loading(`Deleting order...`);
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await transaction.get(orderRef);
        if (!orderDoc.exists()) {
          throw new Error("Order not found!");
        }
        const orderData = orderDoc.data() as Order;

        // Only restore stock if the order wasn't already cancelled
        if (orderData.status !== 'Cancelled') {
          for (const item of orderData.items) {
            const productRef = doc(db, 'products', item.id);
            const productDoc = await transaction.get(productRef);
            if (productDoc.exists()) {
              const newStock = productDoc.data().stock + item.quantity;
              transaction.update(productRef, { stock: newStock });
            }
          }
        }
        
        transaction.delete(orderRef);
      });
      toast.success(`Order deleted successfully!`, { id: toastId });
    } catch (error: any) {
      console.error("Error deleting order: ", error);
      toast.error(error.message || 'Failed to delete order.', { id: toastId });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>No orders match the current filters.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20 hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className="border-primary/20 hover:bg-secondary/50 cursor-pointer"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <TableCell>
                  <div className="font-medium text-foreground">{order.deliveryAddress?.fullName}</div>
                  <div className="text-sm text-muted-foreground">{order.userPhone}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{order.items?.length ?? 0} items</TableCell>
                <TableCell className="text-muted-foreground">₹{(order.totalPrice ?? 0).toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-muted-foreground">{order.orderDate ? new Date(order.orderDate.seconds * 1000).toLocaleDateString() : '...'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('font-semibold', getStatusClass(order.status))}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-primary/20">
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Processing')} className="cursor-pointer">Mark as Processing</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Shipped')} className="cursor-pointer">Mark as Shipped</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Delivered')} className="cursor-pointer">Mark as Delivered</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Cancelled')} className="cursor-pointer text-destructive">Mark as Cancelled</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the order and restore the stock for all items in this order.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteOrder(order.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-primary">Order Logs</h1>
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">All Customer Orders</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Ordered">Ordered</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderLogs;