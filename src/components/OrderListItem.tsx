import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order';
import { cn } from '@/lib/utils';
import { IndianRupee, Calendar, MapPin, Eye, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getStatusClass } from '@/utils/orderUtils';

interface OrderListItemProps {
  order: Order;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeInOut } },
};

const OrderListItem: React.FC<OrderListItemProps> = ({ order }) => {
  const navigate = useNavigate();
  const { cancelOrder } = useAuth();
  const firstItem = order.items[0];
  const additionalItemsCount = order.items.length - 1;

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await cancelOrder(order);
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-soft-lg overflow-hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-6 items-stretch">
          <img
            src={firstItem.image}
            alt={firstItem.productTitle}
            className="w-full sm:w-40 h-40 sm:h-auto object-cover rounded-lg border border-primary/10 flex-shrink-0"
          />
          <div className="flex-grow flex flex-col justify-between space-y-3">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-foreground leading-tight">{firstItem.productTitle}</h3>
                <Badge variant="outline" className={cn('font-semibold whitespace-nowrap', getStatusClass(order.status))}>
                  {order.status}
                </Badge>
              </div>
              {additionalItemsCount > 0 && (
                <p className="text-sm text-muted-foreground mb-2">+ {additionalItemsCount} more item(s)</p>
              )}
              <p className="text-xs text-muted-foreground">Order ID: ...{order.id.slice(-12)}</p>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary/80" /> Ordered on: {order.orderDate ? new Date(order.orderDate.seconds * 1000).toLocaleDateString() : '...'}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary/80" /> Delivery to: {order.deliveryAddress.city}</p>
            </div>

            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <IndianRupee className="h-6 w-6" />
              <span>{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col justify-end items-center sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-primary/10 pt-4 sm:pt-0 sm:pl-4 -mr-4 -mb-4 sm:m-0 p-4 sm:p-0 sm:px-4 bg-secondary/30 sm:bg-transparent">
            <Button
              onClick={() => navigate(`/order/${order.id}`)}
              className="w-full bg-primary/10 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground hover-glow"
            >
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
            {order.status === 'Ordered' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full" onClick={(e) => e.stopPropagation()}>
                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your order. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Yes, Cancel Order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderListItem;