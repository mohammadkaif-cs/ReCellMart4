import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Camera, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  city: z.string().min(1, 'Please select a city.'),
  addressLine1: z.string().min(5, 'Address is required.'),
  addressLine2: z.string().optional(),
  landmark: z.string().min(3, 'Landmark is required.'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits.'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSave: (values: ProfileFormValues, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  isCancellable: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave, onCancel, isCancellable }) => {
  const { userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(userProfile?.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supportedCities = ['Kalyan', 'Bhiwandi', 'Thane'];

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      city: userProfile?.city || '',
      addressLine1: userProfile?.addressLine1 || '',
      addressLine2: userProfile?.addressLine2 || '',
      landmark: userProfile?.landmark || '',
      pincode: userProfile?.pincode || '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    await onSave(values, imageFile);
    setIsSubmitting(false);
  };

  const userInitial = userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : userProfile?.email?.charAt(0).toUpperCase();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={previewUrl || undefined} alt={userProfile?.name} />
              <AvatarFallback className="text-3xl bg-secondary">{userInitial}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="addressLine1" render={({ field }) => (<FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="House No, Building, Street" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="addressLine2" render={({ field }) => (<FormItem><FormLabel>Address Line 2 (Optional)</FormLabel><FormControl><Input placeholder="Apartment, suite, etc." {...field} /></FormControl></FormItem>)} />
        <FormField control={form.control} name="landmark" render={({ field }) => (<FormItem><FormLabel>Landmark</FormLabel><FormControl><Input placeholder="Near City Park" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="pincode" render={({ field }) => (<FormItem><FormLabel>Pincode</FormLabel><FormControl><Input placeholder="400001" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select your city" /></SelectTrigger></FormControl>
              <SelectContent>{supportedCities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end items-center pt-4 gap-4">
          {isCancellable && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-shadow transition-all duration-300">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;