import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateTicketForm from './CreateTicketForm';
import TicketListItem from './TicketListItem';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const MySupportTickets = () => {
  const { supportTickets, supportTicketsLoading, orders } = useAuth();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  if (supportTicketsLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Support Tickets</CardTitle>
          <CardDescription>View your past tickets or create a new one.</CardDescription>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a New Support Ticket</DialogTitle>
            </DialogHeader>
            <CreateTicketForm onClose={() => setCreateDialogOpen(false)} orders={orders} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {supportTickets.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-lg">
            <MessageSquareWarning className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tickets found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Click "Create Ticket" to get started.</p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {supportTickets.map((ticket) => (
              <TicketListItem key={ticket.id} ticket={ticket} />
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default MySupportTickets;