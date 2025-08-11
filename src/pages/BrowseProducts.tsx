import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { phoneBrands, laptopBrands } from '@/data/filters';
import { Product } from '@/types/product';
import FilterPanel from '@/components/products/FilterPanel';
import ProductCard from '@/components/products/ProductCard';
import { Frown, Loader2, Clock } from 'lucide-react';
import { db } from '@/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const BrowseProducts = () => {
  const { category = 'mobiles' } = useParams<{ category: 'mobiles' | 'laptops' }>();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'products'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedProducts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Product;
      });
      
      setAllProducts(fetchedProducts);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products: ", err);
      setError("Failed to load products. Please try again later.");
      toast.error("Failed to load products.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const currentCategory = category === 'mobiles' ? 'Phone' : 'Laptop';
  const brandOptions = category === 'mobiles' ? phoneBrands : laptopBrands;

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const categoryMatch = p.type === currentCategory;

      const searchMatch = searchTerm === '' ||
        p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const maxPrice = priceFilter ? parseFloat(priceFilter) : Infinity;
      const priceMatch = p.price <= maxPrice;

      const brandMatch = brandFilter === 'all' || p.brand === brandFilter;

      const stockMatch = p.stock > 0;

      return categoryMatch && searchMatch && priceMatch && brandMatch && stockMatch;
    });
  }, [allProducts, currentCategory, searchTerm, priceFilter, brandFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setPriceFilter('');
    setBrandFilter('all');
  };

  const handleTabChange = (value: string) => {
    navigate(`/browse/${value}`);
    resetFilters();
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

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </Layout>
    );
  }

  const isLaptops = category === 'laptops';

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="space-y-8 pt-6"
      >
        <div className="flex flex-col items-center space-y-4">
          <Tabs value={category} onValueChange={handleTabChange} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 bg-card border">
              <TabsTrigger value="mobiles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Mobiles</TabsTrigger>
              <TabsTrigger value="laptops" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Laptops</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              brandFilter={brandFilter}
              setBrandFilter={setBrandFilter}
              brandOptions={brandOptions}
              resetFilters={resetFilters}
            />
          </div>
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            ) : isLaptops ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[40vh] bg-card rounded-lg border-2 border-dashed border-border p-8"
              >
                <Clock className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold text-foreground">Coming Soon!</h3>
                <p className="text-muted-foreground mt-2">Laptops will be available shortly. Stay tuned!</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[40vh] bg-card rounded-lg border-2 border-dashed border-border p-8"
              >
                <Frown className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold text-foreground">No Products Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default BrowseProducts;