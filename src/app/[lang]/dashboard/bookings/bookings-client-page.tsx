
'use client';

import { useState } from 'react';
import { BookingList } from './booking-list';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { BookingWithDetails } from '@/backend/bookings/domain/booking.model';
import { Locale } from '@/dictionaries/config';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface BookingsClientPageProps {
  initialBookings: BookingWithDetails[];
  error?: string;
  lang: Locale;
}

export function BookingsClientPage({ initialBookings, error, lang }: BookingsClientPageProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);

  const handleViewBooking = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'confirmed': return 'default';
        case 'succeeded': return 'default';
        case 'pending': return 'secondary';
        case 'cancelled': return 'destructive';
        case 'refunded': return 'destructive';
        default: return 'outline';
    }
  }
  
  const DetailRow = ({ label, value, isMono }: { label: string, value: React.ReactNode, isMono?: boolean }) => (
    value ? (
        <div className="flex justify-between py-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className={`font-semibold text-right ${isMono ? 'font-mono text-xs' : ''}`}>{value}</dd>
        </div>
    ) : null
  );

  return (
    <>
      <BookingList
        bookings={initialBookings}
        error={error}
        lang={lang}
        onView={handleViewBooking}
      />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl p-0 overflow-y-auto">
          {selectedBooking && (
            <>
              <SheetHeader className="p-6">
                <SheetTitle className="text-2xl">Booking Details</SheetTitle>
                <SheetDescription>
                    ID: <span className="font-mono">{selectedBooking.id}</span>
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 space-y-6">
                 <dl className="divide-y divide-border border rounded-lg p-4">
                    <DetailRow label="Tour" value={selectedBooking.tour?.title?.[lang] || selectedBooking.tour?.title?.en} />
                    <DetailRow label="Date" value={format(new Date(selectedBooking.date), 'PPP')} />
                    <DetailRow label="Customer" value={selectedBooking.customerName} />
                    <DetailRow label="Participants" value={`${selectedBooking.adults} Adults, ${selectedBooking.children} Children`} />
                 </dl>

                <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Pickup Information</h4>
                    <p className="text-sm font-medium">{selectedBooking.hotelName}</p>
                    <p className="text-xs text-muted-foreground">Hotel</p>
                    <Separator className="my-2" />
                    <p className="text-sm font-medium">{selectedBooking.meetingPointName}</p>
                    <p className="text-xs text-muted-foreground">Meeting Point</p>
                </div>
                 
                 <div className="border rounded-lg">
                    <h4 className="font-bold p-4 border-b">Financials</h4>
                    <dl className="divide-y divide-border px-4">
                        <DetailRow label="Total Price" value={`€${selectedBooking.totalPrice.toFixed(2)}`} />
                        <DetailRow label="Amount Paid" value={`€${selectedBooking.amountPaid.toFixed(2)}`} />
                        <DetailRow label="Amount Due" value={<span className="text-accent">€{selectedBooking.amountDue.toFixed(2)}</span>} />
                        <DetailRow label="Payment Type" value={<Badge variant="outline" className="capitalize">{selectedBooking.paymentType}</Badge>} />
                        <DetailRow label="Booking Status" value={<Badge variant={getStatusVariant(selectedBooking.status)} className="capitalize">{selectedBooking.status}</Badge>} />
                        <DetailRow label="Payment Status" value={<Badge variant={getStatusVariant(selectedBooking.payment?.status || 'pending')} className="capitalize">{selectedBooking.payment?.status || 'pending'}</Badge>} />
                        <DetailRow label="Stripe Payment ID" value={selectedBooking.payment?.stripePaymentIntentId} isMono />
                        <DetailRow label="Stripe Refund ID" value={selectedBooking.payment?.refundId} isMono />
                    </dl>
                 </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
