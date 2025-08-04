import React, { useState } from 'react';
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
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Loader2, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const AddProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { 
      verified: false, 
      type: 'Phone', 
      faults: 'None', 
      warranty: 'No Warranty',
      stock: 0,
      media: { imageUrls: '', videoUrl: '' },
      specs: { processor: '', ram: '', storage: '', battery: '', display: '', os: '' }
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    const mainToastId = toast.loading('Saving product...');

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
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'products'), productData);

      toast.success('Product added successfully!', { id: mainToastId, duration: 4000 });
      form.reset();
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(`Submission failed: ${error.message || 'An unexpected error occurred.'}`, { id: mainToastId, duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Core Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="model" render={({ field }) => (<FormItem><FormLabel>Product Model</FormLabel><FormControl><Input placeholder="e.g., iPhone 14 Pro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description of the product..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="specs.processor" render={({ field }) => (<FormItem><FormLabel>Processor</FormLabel><FormControl><Input placeholder="e.g., A16 Bionic" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.ram" render={({ field }) => (<FormItem><FormLabel>RAM</FormLabel><FormControl><Input placeholder="e.g., 6GB" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.storage" render={({ field }) => (<FormItem><FormLabel>Storage</FormLabel><FormControl><Input placeholder="e.g., 256GB" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.battery" render={({ field }) => (<FormItem><FormLabel>Battery</FormLabel><FormControl><Input placeholder="e.g., 98% Health" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.display" render={({ field }) => (<FormItem><FormLabel>Display</FormLabel><FormControl><Input placeholder="e.g., 6.1-inch OLED" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="specs.os" render={({ field }) => (<FormItem><FormLabel>Operating System</FormLabel><FormControl><Input placeholder="e.g., iOS 17" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Media URLs</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="media.imageUrls" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs</FormLabel>
                      <FormControl><Textarea placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png" {...field} rows={4} /></FormControl>
                      <FormDescription>Paste one image URL per line.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="media.videoUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl><Input type="url" placeholder="https://example.com/video.mp4" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle>Properties</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Phone">Phone</SelectItem><SelectItem value="Laptop">Laptop</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="brand" render={({ field }) => (<FormItem><FormLabel>Brand</FormLabel><FormControl><Input placeholder="e.g., Apple" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" placeholder="e.g., 89999" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="stock" render={({ field }) => (<FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="condition" render={({ field }) => (<FormItem><FormLabel>Condition</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Like New">Like New</SelectItem><SelectItem value="Faulty">Faulty</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="warranty" render={({ field }) => (<FormItem><FormLabel>Warranty</FormLabel><FormControl><Input placeholder="e.g., 6 Months" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="faults" render={({ field }) => (<FormItem><FormLabel>Faults</FormLabel><FormControl><Input placeholder="e.g., Minor scratch on back" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="verified" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3"><FormLabel>Verified</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-soft-lg hover:scale-105 transition-transform duration-300 min-w-[150px]">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Add Product
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AddProduct;