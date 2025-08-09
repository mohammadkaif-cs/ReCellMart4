import { Order } from '@/types/order';

export const getStatusClass = (status: Order['status']) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Ordered':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Processing':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Shipped':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};