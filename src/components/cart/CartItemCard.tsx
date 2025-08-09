import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart';
import { useAuth } from '@/context/AuthContext';
import { Trash2, IndianRupee } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { removeFromCart } = useAuth();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-primary/20 overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <img src={item.image} alt={item.productTitle} className="w-24 h-24 object-cover rounded-md border" />
          <div className="flex-grow space-y-2">
            <h3 className="font-semibold text-foreground">{item.productTitle}</h3>
            <p className="flex items-center text-lg font-bold text-primary">
              <IndianRupee className="h-5 w-5" />
              {item.price.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CartItemCard;