export interface Order {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  date: string;
  status: 'Delivered' | 'Pending Dispatch' | 'Cancelled';
}

export interface Ticket {
  id: string;
  productName: string;
  status: 'Open' | 'Replied' | 'Resolved';
  issue: string;
  description: string;
  reply?: string;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  profileCompleted: boolean;
  role: 'user' | 'admin' | 'moderator';
  avatarUrl?: string;
  termsAccepted?: boolean;
}

export const dashboardData = {
  orders: [
    {
      id: 'ord123',
      productId: 'phone001',
      productName: 'Apple iPhone 13',
      productImage: 'https://images.unsplash.com/photo-1633052618999-276940035419?q=80&w=200',
      price: 52999,
      date: '2024-07-28',
      status: 'Delivered',
    },
    {
      id: 'ord124',
      productId: 'laptop001',
      productName: 'MacBook Air M1',
      productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=200',
      price: 75000,
      date: '2024-07-25',
      status: 'Delivered',
    },
    {
      id: 'ord125',
      productId: 'phone002',
      productName: 'Samsung Galaxy S21',
      productImage: 'https://images.unsplash.com/photo-1610945415242-a8b8d463c4a3?q=80&w=200',
      price: 38500,
      date: '2024-08-01',
      status: 'Pending Dispatch',
    },
  ] as Order[],
  tickets: [
    {
      id: 'sup001',
      productName: 'Apple iPhone 13',
      status: 'Replied',
      issue: 'Battery draining fast',
      description: 'The battery on my new iPhone 13 seems to be draining much faster than expected, even with light usage.',
      reply: "We've received your ticket. An inspection call will be arranged within 24 hours to diagnose the issue.",
      date: '2024-07-29',
    },
    {
      id: 'sup002',
      productName: 'MacBook Air M1',
      status: 'Resolved',
      issue: 'Screen flickering issue',
      description: 'The screen flickers occasionally, especially on low brightness.',
      reply: 'This was resolved after a software update. Please let us know if the issue persists.',
      date: '2024-07-26',
    },
  ] as Ticket[],
  profile: {
    name: 'Kaif Ansari',
    email: 'k69920049@gmail.com',
    phone: '7066380503',
    city: 'Thane',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pincode: '',
    profileCompleted: false,
    role: 'admin',
    avatarUrl: '',
    termsAccepted: false,
  } as UserProfile,
};

export const maharashtraCities = [
  'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Kalyan', 'Bhiwandi', 'Aurangabad', 'Solapur', 'Amravati', 'Navi Mumbai', 'Kolhapur', 'Akola', 'Latur', 'Dhule', 'Jalgaon', 'Nanded', 'Sangli'
];