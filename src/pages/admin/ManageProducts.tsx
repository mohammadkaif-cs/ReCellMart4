import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/firebase';
import { collection, onSnapshot, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Loader2, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      
      // Sort client-side to handle documents that might be missing the createdAt field
      fetchedProducts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setProducts(fetchedProducts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      toast.error("Failed to fetch products.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    const toastId = toast.loading('Deleting product...');
    try {
      await deleteDoc(doc(db, 'products', productId));
      toast.success('Product deleted successfully!', { id: toastId });
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error('Failed to delete product.', { id: toastId });
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p>No products found. Click "Add Product" to get started.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Product</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-border hover:bg-secondary/50">
                <TableCell className="font-medium text-foreground">{product.model}</TableCell>
                <TableCell><Badge variant="outline">{product.brand}</Badge></TableCell>
                <TableCell className="text-muted-foreground">₹{product.price.toLocaleString('en-IN')}</TableCell>
                <TableCell>
                  <Badge className={product.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                    {product.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => navigate(`/admin/products/edit/${product.id}`)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product
                          <span className="font-bold text-primary"> {product.model}</span>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Manage Products</h1>
        <Button onClick={() => navigate('/admin/products/add')} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-soft-lg hover:scale-105 transition-transform duration-300">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Product
        </Button>
      </div>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageProducts;