import React, { useState } from 'react';
import { SupportTicket } from '@/types/ticket';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TicketDetailSheetProps {
  ticket: SupportTicket;
  onClose: () => void;
}

const TicketDetailSheet: React.FC<TicketDetailSheetProps> = ({ ticket, onClose }) => {
  const [newStatus, setNewStatus] = useState<SupportTicket['status']>(ticket.status);
  const [response, setResponse] = useState(ticket.adminResponse || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    const ticketRef = doc(db, 'supportTickets', ticket.id);
    try {
      await updateDoc(ticketRef, {
        status: newStatus,
        adminResponse: response,
        updatedAt: serverTimestamp(),
      });
      toast.success('Ticket updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4 space-y-6">
      <div className="space-y-1">
        <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
        <p className="text-sm text-muted-foreground">From: {ticket.userName} ({ticket.userEmail})</p>
        <p className="text-sm text-muted-foreground">Type: {ticket.type}</p>
        {ticket.orderId && (
          <p className="text-sm text-muted-foreground">
            Related Order: {' '}
            <Link to={`/order/${ticket.orderId}`} className="text-primary" onClick={onClose}>
              #{ticket.orderId.slice(-12)}
            </Link>
          </p>
        )}
      </div>
      <div className="p-4 bg-secondary/50 rounded-md">
        <h4 className="font-semibold mb-2 text-foreground">User's Message:</h4>
        <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
      </div>
      <div className="space-y-2">
        <label className="font-medium text-foreground">Status</label>
        <Select value={newStatus} onValueChange={(value: SupportTicket['status']) => setNewStatus(value)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="font-medium text-foreground">Admin Response</label>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your response here..."
          rows={6}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleUpdate} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default TicketDetailSheet;