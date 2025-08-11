import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, IndianRupee, User, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutPage: React.FC = () => {
  const { cart, userProfile, placeOrder } = useAuth();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  const handlePlaceOrder = async () => {
    if (!userProfile?.profileCompleted) {
      toast.error("Please complete your profile before placing an order.", {
        action: { label: 'Go to Profile', onClick: () => navigate('/dashboard?tab=profile') },
      });
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      await placeOrder();
      // The placeOrder function will navigate on success
    } catch (error: any) {
      toast.error(error.message || "Failed to place order.");
      setIsPlacingOrder(false);
    }
  };

  const fullAddress = [
    userProfile?.addressLine1,
    userProfile?.addressLine2,
    userProfile?.city,
    userProfile?.pincode,
  ].filter(Boolean).join(', ');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center gap-3"><User className="h-5 w-5 text-primary/80" /> {userProfile?.name}</p>
                <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary/80" /> {userProfile?.phone}</p>
                <p className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary/80 mt-1" /> {fullAddress}</p>
                <Button variant="link" onClick={() => navigate('/dashboard?tab=profile')} className="p-0 h-auto">Edit Address</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md bg-secondary/50">
                  <h3 className="font-semibold text-foreground">Cash on Delivery (COD)</h3>
                  <p className="text-sm text-muted-foreground">Pay with cash upon receiving your order.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground truncate pr-4">{item.productTitle}</span>
                    <span className="font-medium text-foreground">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="border-t my-2 pt-2 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Delivery</span>
                    <span className="text-green-500 font-medium">FREE</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="flex items-center"><IndianRupee className="h-5 w-5" />{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handlePlaceOrder} disabled={isPlacingOrder || cart.length === 0} size="lg" className="w-full">
              {isPlacingOrder ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Place Order (COD)
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;