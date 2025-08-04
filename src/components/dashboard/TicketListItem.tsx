import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { SupportTicket } from '@/types/ticket';
import { cn } from '@/lib/utils';

interface TicketListItemProps {
  ticket: SupportTicket;
}

const getStatusClass = (status: SupportTicket['status']) => {
  switch (status) {
    case 'Resolved':
    case 'Closed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Open':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'In Progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TicketListItem: React.FC<TicketListItemProps> = ({ ticket }) => {
  return (
    <motion.div variants={itemVariants}>
      <Accordion type="single" collapsible className="w-full border border-primary/20 rounded-lg px-4 bg-card">
        <AccordionItem value={ticket.id} className="border-b-0">
          <AccordionTrigger>
            <div className="flex justify-between items-center w-full pr-4">
              <span className="font-medium text-left text-foreground truncate">{ticket.subject}</span>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleDateString() : '...'}
                </span>
                <Badge variant="outline" className={cn('font-semibold', getStatusClass(ticket.status))}>
                  {ticket.status}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-md">
              <h4 className="font-semibold mb-2 text-foreground">Your Message:</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
            </div>
            {ticket.adminResponse && (
              <div className="p-4 bg-blue-500/10 rounded-md">
                <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">Admin Response:</h4>
                <p className="text-blue-700 dark:text-blue-200 whitespace-pre-wrap">{ticket.adminResponse}</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default TicketListItem;