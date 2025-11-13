
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, Ticket, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Booking, BookingWithDetails } from '@/backend/bookings/domain/booking.model';
import { Locale } from '@/dictionaries/config';

interface BookingListProps {
  bookings?: BookingWithDetails[];
  error?: string;
  lang: Locale;
  onView: (booking: BookingWithDetails) => void;
}

export function BookingList({ bookings, error, lang, onView }: BookingListProps) {

  if (error) {
    return <p className="text-destructive text-center py-12">Error: {error}</p>;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">
          No bookings found.
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          When you book a tour, it will appear here.
        </p>
        <Button asChild className="mt-4">
            <Link href={`/${lang}/tours`}>Explore Tours</Link>
        </Button>
      </div>
    );
  }
  
  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'confirmed': return 'default';
        case 'pending': return 'secondary';
        case 'cancelled': return 'destructive';
        default: return 'outline';
    }
  }

  const getTicketStatusVariant = (status: string) => {
    switch (status) {
        case 'valid': return 'default';
        case 'redeemed': return 'secondary';
        case 'expired': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tour</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount Paid</TableHead>
          <TableHead>Amount Due</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Ticket Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => {
          return (
            <TableRow key={booking.id}>
                <TableCell className="font-medium">
                {booking.tour?.title?.[lang] || booking.tour?.title?.en || 'N/A'}
                </TableCell>
                <TableCell>
                    <div className="font-medium">{booking.customerName}</div>
                    <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
                </TableCell>
                <TableCell>
                {format(new Date(booking.date), 'PPP')}
                </TableCell>
                 <TableCell className="font-medium">€{booking.amountPaid.toFixed(2)}</TableCell>
                 <TableCell className="font-medium text-accent">€{booking.amountDue.toFixed(2)}</TableCell>
                <TableCell>
                <Badge variant={getStatusVariant(booking.status)} className="capitalize">
                    {booking.status}
                </Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={getTicketStatusVariant(booking.ticketStatus)} className="capitalize">
                        {booking.ticketStatus === 'valid' && <CheckCircle className="mr-2 h-3 w-3" />}
                        {booking.ticketStatus === 'redeemed' && <Ticket className="mr-2 h-3 w-3" />}
                        {booking.ticketStatus === 'expired' && <AlertCircle className="mr-2 h-3 w-3" />}
                        {booking.ticketStatus}
                    </Badge>
                </TableCell>
                <TableCell>
                <Button variant="outline" size="sm" onClick={() => onView(booking)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </Button>
                </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
