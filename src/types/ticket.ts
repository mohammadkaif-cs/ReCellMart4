import { Timestamp } from 'firebase/firestore';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  type: 'Order Issue' | 'Technical Problem' | 'Payment' | 'General Inquiry';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  adminResponse?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}