import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { auth, db } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, deleteDoc, addDoc, serverTimestamp, writeBatch, Timestamp, runTransaction, query, where, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/data/dashboard';
import { Product } from '@/types/product';
import { CartItem } from '@/types/cart';
import { Order } from '@/types/order';
import { SupportTicket } from '@/types/ticket';

const ADMIN_EMAILS = [
  'kaifikrar333@gmail.com',
  'ayanansari89@gmail.com',
  'faisalshah89@gmail.com'
];

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in instead.';
    case 'auth/weak-password':
      return 'The password is too weak. It must be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in process was cancelled.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.';
    default:
      console.error('Unhandled Auth Error:', errorCode);
      return 'An unexpected error occurred. Please try again.';
  }
};

interface AuthContextType {
  currentUser: User | null;
  userRole: 'admin' | 'user' | 'moderator' | null;
  userProfile: UserProfile | null;
  isProfileComplete: boolean | null;
  loading: boolean;
  loadingProfile: boolean;
  cart: CartItem[];
  cartLoading: boolean;
  orders: Order[];
  ordersLoading: boolean;
  supportTickets: SupportTicket[];
  supportTicketsLoading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  placeOrder: () => Promise<void>;
  cancelOrder: (order: Order) => Promise<void>;
  createSupportTicket: (data: { type: 'Order Issue' | 'Technical Problem' | 'Payment' | 'General Inquiry'; subject: string; description: string; orderId?: string }) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | 'moderator' | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [supportTicketsLoading, setSupportTicketsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async (user: User) => {
    setLoadingProfile(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const profileData = userDocSnap.data() as UserProfile;
        setUserProfile(profileData);
        setUserRole(profileData.role);
        setIsProfileComplete(profileData.profileCompleted === true);
      } else {
        const expectedRole = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') ? 'admin' : 'user';
        const newProfile: UserProfile = {
          email: user.email || '',
          name: user.displayName || '',
          phone: user.phoneNumber || '',
          city: '',
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          pincode: '',
          profileCompleted: false,
          role: expectedRole,
          avatarUrl: user.photoURL || '',
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
        setUserRole(expectedRole);
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
      setUserRole(null);
      setIsProfileComplete(null);
      toast.error("Could not load your profile. Please contact support.");
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserProfile(null);
        setIsProfileComplete(null);
        setLoadingProfile(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (!currentUser) {
      setCart([]);
      setCartLoading(false);
      setOrders([]);
      setOrdersLoading(false);
      setSupportTickets([]);
      setSupportTicketsLoading(false);
      return;
    }

    setCartLoading(true);
    const cartUnsub = onSnapshot(collection(db, 'users', currentUser.uid, 'cart'), (snapshot) => {
      setCart(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CartItem[]);
      setCartLoading(false);
    });

    setOrdersLoading(true);
    const ordersQuery = query(collection(db, 'orders'), where('userId', '==', currentUser.uid), orderBy('orderDate', 'desc'));
    const ordersUnsub = onSnapshot(ordersQuery, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
      setOrdersLoading(false);
    });

    setSupportTicketsLoading(true);
    const ticketsQuery = query(collection(db, 'supportTickets'), where('userId', '==', currentUser.uid));
    const ticketsUnsub = onSnapshot(ticketsQuery, (snapshot) => {
      const fetchedTickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SupportTicket[];
      fetchedTickets.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setSupportTickets(fetchedTickets);
      setSupportTicketsLoading(false);
    }, (err) => {
      console.error("Error fetching tickets: ", err);
      toast.error("Failed to load support tickets.");
      setSupportTicketsLoading(false);
    });

    return () => {
      cartUnsub();
      ordersUnsub();
      ticketsUnsub();
    };
  }, [currentUser]);

  const refreshUserProfile = useCallback(async () => {
    if (currentUser) {
      await fetchUserProfile(currentUser);
    }
  }, [currentUser, fetchUserProfile]);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';
      const profileData: UserProfile = {
        email: user.email!,
        name: name,
        phone: user.phoneNumber || '',
        city: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        pincode: '',
        profileCompleted: false,
        role: role,
        avatarUrl: '',
      };
      await setDoc(doc(db, 'users', user.uid), profileData);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code || error.message));
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const role = ADMIN_EMAILS.includes(user.email?.toLowerCase() || '') ? 'admin' : 'user';
        const profileData: UserProfile = {
          email: user.email!,
          name: user.displayName || 'New User',
          phone: user.phoneNumber || '',
          city: '',
          addressLine1: '',
          addressLine2: '',
          landmark: '',
          pincode: '',
          profileCompleted: false,
          role: role,
          avatarUrl: user.photoURL || '',
        };
        await setDoc(doc(db, 'users', user.uid), profileData);
        toast.success('Welcome! Your account has been created.');
      } else {
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      toast.info('Logged out successfully!');
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
      throw error;
    }
  };

  const addToCart = async (product: Product) => {
    if (!currentUser) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    const cartItemRef = doc(db, 'users', currentUser.uid, 'cart', product.id);
    const toastId = toast.loading("Adding to cart...");
    try {
      const docSnap = await getDoc(cartItemRef);
      if (docSnap.exists()) {
        toast.info('This item is already in your cart.', { id: toastId });
      } else {
        const productTitle = product.model.toLowerCase().startsWith(product.brand.toLowerCase()) ? product.model : `${product.brand} ${product.model}`;
        const newCartItem: Omit<CartItem, 'id'> = { productTitle, price: product.price, image: product.media.images[0] || '', quantity: 1 };
        await setDoc(cartItemRef, newCartItem);
        toast.success('Product added to cart!', { id: toastId });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error('Failed to add item to cart.', { id: toastId });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!currentUser) return;
    const cartItemRef = doc(db, 'users', currentUser.uid, 'cart', itemId);
    const toastId = toast.loading("Removing item...");
    try {
      await deleteDoc(cartItemRef);
      toast.success("Item removed from cart.", { id: toastId });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item.", { id: toastId });
    }
  };

  const placeOrder = async () => {
    if (!currentUser || !userProfile || cart.length === 0) throw new Error("Cannot place order. User not logged in or cart is empty.");
    const toastId = toast.loading("Placing your order...");
    try {
      const orderId = await runTransaction(db, async (transaction) => {
        const productRefsAndData = await Promise.all(cart.map(async (item) => ({ ref: doc(db, 'products', item.id), doc: await transaction.get(doc(db, 'products', item.id)), cartItem: item })));
        for (const { doc: productDoc, cartItem } of productRefsAndData) {
          if (!productDoc.exists() || productDoc.data().stock < cartItem.quantity) throw new Error(`Sorry, "${cartItem.productTitle}" is out of stock.`);
        }
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const orderData: Omit<Order, 'id'> = { userId: currentUser.uid, userPhone: userProfile.phone, deliveryAddress: { fullName: userProfile.name, street: userProfile.addressLine1, city: userProfile.city, pincode: userProfile.pincode }, items: cart, totalPrice, status: 'Ordered', orderDate: serverTimestamp() as Timestamp, paymentMethod: 'COD' };
        const newOrderRef = doc(collection(db, 'orders'));
        transaction.set(newOrderRef, orderData);
        for (const { ref, doc: productDoc, cartItem } of productRefsAndData) {
          transaction.update(ref, { stock: productDoc.data().stock - cartItem.quantity });
        }
        cart.forEach(item => transaction.delete(doc(collection(db, 'users', currentUser.uid, 'cart'), item.id)));
        return newOrderRef.id;
      });
      toast.success("Order placed successfully!", { id: toastId });
      navigate(`/order-success/${orderId}`);
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast.error(error.message || "There was a problem placing your order.", { id: toastId });
      throw error;
    }
  };

  const cancelOrder = async (order: Order) => {
    if (!currentUser) throw new Error("You must be logged in to cancel an order.");
    const toastId = toast.loading("Cancelling order...");
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'Cancelled' } : o));
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'orders', order.id);
        for (const item of order.items) {
          const productRef = doc(db, 'products', item.id);
          const productDoc = await transaction.get(productRef);
          if (productDoc.exists()) transaction.update(productRef, { stock: productDoc.data().stock + item.quantity });
        }
        transaction.update(orderRef, { status: 'Cancelled' });
      });
      toast.success("Order cancelled successfully.", { id: toastId });
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast.error(error.message || "Failed to cancel order.", { id: toastId });
      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
      throw error;
    }
  };

  const createSupportTicket = async (data: { type: 'Order Issue' | 'Technical Problem' | 'Payment' | 'General Inquiry'; subject: string; description: string; orderId?: string }) => {
    if (!currentUser || !userProfile) {
      toast.error("You must be logged in to create a ticket.");
      return;
    }
    const toastId = toast.loading("Submitting ticket...");
    try {
      const newTicket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'> & { orderId?: string } = {
        ...data,
        userId: currentUser.uid,
        userName: userProfile.name,
        userEmail: userProfile.email,
        status: 'Open',
      };
      
      if (!newTicket.orderId) {
        delete newTicket.orderId;
      }

      await addDoc(collection(db, 'supportTickets'), {
        ...newTicket,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Support ticket created successfully!", { id: toastId });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket.", { id: toastId });
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("If an account with that email exists, a password reset link has been sent.");
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        throw new Error(getAuthErrorMessage(error.code));
      }
      toast.success("If an account with that email exists, a password reset link has been sent.");
    }
  };

  const value = {
    currentUser, userRole, userProfile, isProfileComplete, loading, loadingProfile,
    cart, cartLoading, orders, ordersLoading, supportTickets, supportTicketsLoading,
    signup, login, signInWithGoogle, logout, refreshUserProfile, addToCart, removeFromCart, placeOrder, cancelOrder, createSupportTicket,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};