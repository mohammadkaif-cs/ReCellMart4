import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order';
import { cn } from '@/lib/utils';
import { IndianRupee, Calendar, MapPin, Phone, Eye, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getStatusClass } from '@/utils/orderUtils';

interface OrderCardProps {
  order: Order;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeInOut } },
};

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const { cancelOrder } = useAuth();
  const firstItem = order.items[0];
  const additionalItemsCount = order.items.length - 1;

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/order/${order.id}`);
  };

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await cancelOrder(order);
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-300 hover:glow-shadow">
        <CardHeader className="flex-row items-start justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{firstItem.productTitle}</CardTitle>
            {additionalItemsCount > 0 && (
              <p className="text-sm text-muted-foreground">+ {additionalItemsCount} more item(s)</p>
            )}
          </div>
          <Badge variant="outline" className={cn('font-semibold text-sm', getStatusClass(order.status))}>
            {order.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2 text-lg">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">
                {order.totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary/80" />
              <span>{order.orderDate ? new Date(order.orderDate.seconds * 1000).toLocaleDateString() : '...'}</span>
            </div>
          </div>
          <div className="border-t border-primary/10 pt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary/80" />
              <span>Delivery to: <span className="font-medium text-foreground">{order.deliveryAddress.city}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary/80" />
              <span>Contact: <span className="font-medium text-foreground">{order.userPhone}</span></span>
            </div>
          </div>
          <div className="flex justify-end items-center pt-2 gap-2">
            {order.status === 'Ordered' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderCard;