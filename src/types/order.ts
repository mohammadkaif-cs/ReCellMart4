import { Timestamp } from 'firebase/firestore';
import { CartItem } from './cart';

export interface Order {
  id: string;
  userId: string;
  userPhone: string;
  deliveryAddress: {
    fullName: string;
    street: string;
    city: string;
    pincode: string;
  };
  items: CartItem[];
  totalPrice: number;
  status: 'Ordered' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: Timestamp;
  paymentMethod: 'COD';
}