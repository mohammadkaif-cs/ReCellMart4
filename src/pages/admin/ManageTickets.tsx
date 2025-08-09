import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { SupportTicket } from '@/types/ticket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import TicketDetailSheet from '@/components/admin/TicketDetailSheet';

const getStatusClass = (status: SupportTicket['status']) => {
  switch (status) {
    case 'Resolved': case 'Closed': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Open': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'In Progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const ManageTickets = () => {
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SupportTicket[];
      setAllTickets(tickets);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tickets: ", error);
      toast.error("Failed to fetch support tickets.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => {
      const searchMatch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (ticket.orderId || '').toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All' || ticket.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [allTickets, searchTerm, statusFilter]);

  const handleRowClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsSheetOpen(true);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    if (filteredTickets.length === 0) {
      return <div className="text-center py-12 text-muted-foreground"><p>No tickets match the current filters.</p></div>;
    }
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="border-primary/20 hover:bg-transparent"><TableHead>User</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} onClick={() => handleRowClick(ticket)} className="cursor-pointer hover:bg-secondary/50">
                <TableCell><div className="font-medium text-foreground">{ticket.userName}</div><div className="text-sm text-muted-foreground">{ticket.userEmail}</div></TableCell>
                <TableCell className="text-muted-foreground">{ticket.subject}</TableCell>
                <TableCell><Badge variant="outline" className={cn('font-semibold', getStatusClass(ticket.status))}>{ticket.status}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleDateString() : '...'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Manage Support Tickets</h1>
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">All Tickets</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <div className="relative w-full sm:w-1/3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by subject, email, or order ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger><SelectContent><SelectItem value="All">All Statuses</SelectItem><SelectItem value="Open">Open</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Resolved">Resolved</SelectItem><SelectItem value="Closed">Closed</SelectItem></SelectContent></Select>
          </div>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
          <SheetHeader><SheetTitle>Ticket Details</SheetTitle></SheetHeader>
          {selectedTicket && <TicketDetailSheet ticket={selectedTicket} onClose={() => setIsSheetOpen(false)} />}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default ManageTickets;