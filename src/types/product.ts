import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  type: 'Phone' | 'Laptop';
  brand: string;
  model: string;
  price: number;
  warranty: string;
  condition: 'Good' | 'New' | 'Like New' | 'Faulty';
  verified: boolean;
  stock: number;
  media: {
    images: string[];
    video: string;
  };
  specs: {
    processor: string;
    ram: string;
    storage: string;
    battery: string;
    display: string;
    os: string;
  };
  faults: string;
  description?: string;
  createdAt?: Timestamp;
}