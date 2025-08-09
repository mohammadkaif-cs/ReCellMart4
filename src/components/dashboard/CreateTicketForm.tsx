import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Order } from '@/types/order';

const ticketSchema = z.object({
  type: z.enum(['Order Issue', 'Technical Problem', 'Payment', 'General Inquiry'], {
    required_error: 'Please select a ticket type.',
  }),
  subject: z.string().min(5, 'Subject must be at least 5 characters.').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters.').max(1000),
  orderId: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

// Explicitly define default values to help with type inference
const defaultFormValues: TicketFormValues = {
  type: 'General Inquiry',
  subject: '',
  description: '',
  orderId: '',
};

interface CreateTicketFormProps {
  onClose: () => void;
  orders: Order[];
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onClose, orders }) => {
  const { createSupportTicket } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: defaultFormValues,
  });

  const ticketType = form.watch('type');

  const handleSubmit = async (values: TicketFormValues) => {
    setIsSubmitting(true);
    await createSupportTicket(values);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Order Issue">Order Issue</SelectItem>
                  <SelectItem value="Technical Problem">Technical Problem</SelectItem>
                  <SelectItem value="Payment">Payment Issue</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {ticketType === 'Order Issue' && (
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Order (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <SelectItem key={order.id} value={order.id}>
                          Order #{order.id.slice(-6)} - {order.items[0].productTitle}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-orders" disabled>No recent orders found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField control={form.control} name="subject" render={({ field }) => (<FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Issue with order #123" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Please describe your issue in detail..." {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Ticket
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateTicketForm;