import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import NotFound from './NotFound';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, HardDrive, ShieldCheck, BatteryCharging, ScreenShare, AlertTriangle, CheckCircle, Truck, Loader2, ArrowLeft, Info, Smartphone, ShoppingCart, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Product } from '@/types/product';

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  let videoId: string | null = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }
  } catch (e) {
    return null;
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No product ID provided.");
      return;
    }

    setLoading(true);
    const productRef = doc(db, 'products', id);

    const unsubscribe = onSnapshot(productRef, (docSnap) => {
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        setError(null);
      } else {
        setError("Product not found.");
        setProduct(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching product:", err);
      setError("Failed to load product details.");
      toast.error("Failed to load product details.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    const toastId = toast.loading("Adding to cart...");

    try {
      await addToCart(product);
      toast.success("Product added to cart!", {
        id: toastId,
        action: {
          label: "View Cart",
          onClick: () => navigate('/cart'),
        },
      });
    } catch (error: any) {
      let action;
      if (error.message.includes('log in')) {
        action = { label: 'Login', onClick: () => navigate('/login') };
      } else if (error.message.includes('profile')) {
        action = { label: 'Go to Profile', onClick: () => navigate('/dashboard?tab=profile') };
      } else if (error.message.includes('already in your cart')) {
        action = { label: 'View Cart', onClick: () => navigate('/cart') };
      }
      
      toast.error(error.message, { id: toastId, action });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return <NotFound />;
  }

  const productTitle = product.model.toLowerCase().startsWith(product.brand.toLowerCase())
    ? product.model
    : `${product.brand} ${product.model}`;

  const youTubeEmbedUrl = product.media.video ? getYouTubeEmbedUrl(product.media.video) : null;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 pt-6"
      >
        <div className="mb-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Carousel className="w-full rounded-lg overflow-hidden border shadow-soft">
              <CarouselContent>
                {product.media.images && product.media.images.length > 0 ? (
                  product.media.images.map((image, index) => (
                    <CarouselItem key={`img-${index}`}>
                      <img src={image} alt={`${product.model} image ${index + 1}`} className="w-full h-auto aspect-video object-cover" />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="w-full h-auto aspect-video bg-secondary flex items-center justify-center">
                      <Smartphone className="h-24 w-24 text-muted-foreground" />
                    </div>
                  </CarouselItem>
                )}
                {product.media.video && (
                  <CarouselItem>
                    {youTubeEmbedUrl ? (
                      <iframe
                        className="w-full aspect-video"
                        src={youTubeEmbedUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        src={product.media.video}
                        className="w-full h-auto aspect-video object-cover"
                        controls
                        playsInline
                      />
                    )}
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 flex flex-col space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{productTitle}</h1>
            <p className="text-4xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
            
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="outline"><CheckCircle size={14} className="mr-1 text-green-500" /> Condition: {product.condition}</Badge>
              {product.verified && <Badge variant="outline" className="text-blue-600 border-blue-300">Verified Device</Badge>}
              <Badge variant="secondary">{product.type}</Badge>
            </div>

            <div className="space-y-2 text-muted-foreground pt-4">
              <p className="flex items-center"><Cpu size={16} className="mr-2 text-primary/70" /> {product.specs.ram} RAM</p>
              <p className="flex items-center"><HardDrive size={16} className="mr-2 text-primary/70" /> {product.specs.storage} Storage</p>
              <p className="flex items-center"><ShieldCheck size={16} className="mr-2 text-primary/70" /> Warranty: {product.warranty}</p>
            </div>

            <div className="flex-grow" />

            <div className="bg-secondary p-3 rounded-md text-xs text-muted-foreground space-y-2">
                <p className="flex items-start"><Zap size={20} className="mr-2 text-yellow-500 flex-shrink-0" /> Guaranteed 1-Day Delivery in supported areas.</p>
                <p className="flex items-start"><Truck size={20} className="mr-2 text-primary/70 flex-shrink-0" /> Open Box Delivery in front of the user.</p>
                <p className="flex items-start"><AlertTriangle size={20} className="mr-2 text-primary/70 flex-shrink-0" /> No returns after handover unless a major fault is found within 24 hours.</p>
            </div>

            <Button onClick={handleAddToCart} disabled={isAddingToCart} size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-soft-lg transition-transform duration-300 hover:scale-105 text-lg py-6">
              {isAddingToCart ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
              Add to Cart
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Info size={20} /> Description
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground whitespace-pre-wrap">
              {product.description || 'No description provided.'}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <p className="flex items-center"><Cpu size={16} className="mr-2 text-primary/70" /> Processor: {product.specs.processor}</p>
              <p className="flex items-center"><Smartphone size={16} className="mr-2 text-primary/70" /> RAM: {product.specs.ram}</p>
              <p className="flex items-center"><HardDrive size={16} className="mr-2 text-primary/70" /> Storage: {product.specs.storage}</p>
              <p className="flex items-center"><BatteryCharging size={16} className="mr-2 text-primary/70" /> Battery: {product.specs.battery}</p>
              <p className="flex items-center"><ScreenShare size={16} className="mr-2 text-primary/70" /> Display: {product.specs.display}</p>
              <p className="flex items-center"><CheckCircle size={16} className="mr-2 text-primary/70" /> OS: {product.specs.os}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default ProductDetail;