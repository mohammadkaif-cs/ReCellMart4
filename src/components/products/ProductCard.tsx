import React, { useState } from 'react';
import { motion, easeInOut } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { Cpu, HardDrive, BadgeCheck, Smartphone, ShoppingCart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeInOut } },
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { currentUser, isProfileComplete, addToCart } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const imageUrl = product.media?.images?.[0];

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to product detail page

    if (!currentUser) {
      toast.error('Please log in to add items to your cart.', {
        action: { label: 'Login', onClick: () => navigate('/login') },
      });
      return;
    }

    if (isProfileComplete === false) {
      toast.error('Please complete your profile before adding to cart.', {
        action: { label: 'Go to Profile', onClick: () => navigate('/dashboard?tab=profile') },
      });
      return;
    }
    
    setIsAddingToCart(true);
    await addToCart(product);
    setIsAddingToCart(false);
  };

  const productTitle = product.model.toLowerCase().startsWith(product.brand.toLowerCase())
    ? product.model
    : `${product.brand} ${product.model}`;

  return (
    <motion.div
      variants={cardVariants}
      onClick={handleCardClick}
      className="cursor-pointer group"
      role="link"
      aria-label={`View details for ${product.brand} ${product.model}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
      tabIndex={0}
    >
      <Card className="bg-card border overflow-hidden transition-all duration-300 group-hover:shadow-soft-lg group-hover:border-primary/50 h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="overflow-hidden relative aspect-video bg-secondary flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${product.model} image 1`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Smartphone className="h-24 w-24 text-muted-foreground" />
            )}
             {product.verified && (
              <Badge variant="outline" className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border-blue-500/50 text-blue-500">
                <BadgeCheck className="h-4 w-4 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="p-4 space-y-3 flex-grow">
            <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">{productTitle}</h3>
            <p className="text-2xl font-extrabold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Cpu size={16} /> {product.specs.ram}</span>
              <span className="flex items-center gap-1"><HardDrive size={16} /> {product.specs.storage}</span>
            </div>
          </div>
          <div className="p-4 pt-0">
            <Button 
              size="sm" 
              onClick={handleAddToCart} 
              disabled={isAddingToCart}
              className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {isAddingToCart ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <ShoppingCart size={16} className="mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;