import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Loader2, Save } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';

const productSchema = z.object({
  model: z.string().min(3, 'Product model is required.'),
  brand: z.string().min(1, 'Brand is required.'),
  condition: z.enum(['New', 'Good', 'Like New', 'Faulty'], { required_error: 'Please select a condition.' }),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
  warranty: z.string().optional(),
  faults: z.string().optional(),
  type: z.enum(['Phone', 'Laptop'], { required_error: 'Please select a product type.' }),
  verified: z.boolean().default(false),
  
  media: z.object({
    imageUrls: z.string().min(1, 'At least one image URL is required.'),
    videoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  }),

  specs: z.object({
    processor: z.string().min(3, 'Processor is required.'),
    ram: z.string().min(1, 'RAM is required.'),
    storage: z.string().min(1, 'Storage is required.'),
    battery: z.string().min(2, 'Battery info is required.'),
    display: z.string().min(3, 'Display info is required.'),
    os: z.string().min(2, 'OS info is required.'),
  }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (!productId) {
      toast.error("No product ID provided.");
      navigate('/admin/products');
      return;
    }

    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data() as Product;
          form.reset({
            model: productData.model,
            brand: productData.brand,
            condition: productData.condition,
            description: productData.description || '',
            price: productData.price,
            stock: productData.stock || 0,
            warranty: productData.warranty,
            faults: productData.faults,
            type: productData.type,
            verified: productData.verified,
            media: {
              imageUrls: productData.media.images.join('\n'),
              videoUrl: productData.media.video,
            },
            specs: {
              processor: productData.specs.processor,
              ram: productData.specs.ram,
              storage: productData.specs.storage,
              battery: productData.specs.battery,
              display: productData.specs.display,
              os: productData.specs.os,
            }
          });
        } else {
          toast.error("Product not found.");
          navigate('/admin/products');
        }
      } catch (error) {
        toast.error("Failed to fetch product details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate, form]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!productId) return;
    setIsSubmitting(true);
    const mainToastId = toast.loading('Updating product...');

    try {
      const imageUrls = data.media.imageUrls.split('\n').map(url => url.trim()).filter(url => url);
      if (imageUrls.length === 0) {
        toast.error('Please provide at least one valid image URL.', { id: mainToastId });
        setIsSubmitting(false);
        return;
      }

      const productData = {
        model: data.model,
        brand: data.brand,
        condition: data.condition,
        description: data.description,
        price: data.price,
        stock: data.stock,
        warranty: data.warranty || 'No Warranty',
        faults: data.faults || 'None',
        type: data.type,
        verified: data.verified,
        specs: data.specs,
        media: {
          images: imageUrls,
          video: data.media.videoUrl || '',
        },
      };

      await updateDoc(doc(db, 'products', productId), productData);

      toast.success('Product updated successfully!', { id: mainToastId, duration: 4000 });
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(`Update failed: ${error.message || 'An unexpected error occurred.'}`, { id: mainToastId, duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Edit Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-card border-primary/20">
                <CardHeader><CardTitle>Core Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Product Model</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              <Card className="bg-card border-primary/20">
                <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="specs.processor" render={({ field }) => (<FormItem><FormLabel>Processor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.ram" render={({ field }) => (<FormItem><FormLabel>RAM</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.storage" render={({ field }) => (<FormItem><FormLabel>Storage</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.battery" render={({ field }) => (<FormItem><FormLabel>Battery</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.display" render={({ field }) => (<FormItem><FormLabel>Display</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.os" render={({ field }) => (<FormItem><FormLabel>Operating System</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              <Card className="bg-card border-primary/20">
                <CardHeader><CardTitle>Media URLs</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="media.imageUrls" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs</FormLabel>
                      <FormControl><Textarea {...field} rows={4} /></FormControl>
                      <FormDescription>Paste one image URL per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="media.videoUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl><Input type="url" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-card border-primary/20">
                <CardHeader><CardTitle>Properties</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Phone">Phone</SelectItem><SelectItem value="Laptop">Laptop</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="brand" render={({ field }) => (<FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="stock" render={({ field }) => (<FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="condition" render={({ field }) => (<FormItem><FormLabel>Condition</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Like New">Like New</SelectItem><SelectItem value="Faulty">Faulty</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="warranty" render={({ field }) => (<FormItem><FormLabel>Warranty</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="faults" render={({ field }) => (<FormItem><FormLabel>Faults</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="verified" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border border-primary/20 p-3"><FormLabel>Verified</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-shadow hover-glow min-w-[150px]">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default EditProduct;