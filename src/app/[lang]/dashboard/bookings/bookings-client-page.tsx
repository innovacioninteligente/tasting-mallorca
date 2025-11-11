
'use client';

import { useState } from 'react';
import { BookingList } from './booking-list';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Booking } from '@/backend/bookings/domain/booking.model';
import { Locale } from '@/dictionaries/config';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface BookingsClientPageProps {
  initialBookings: any[];
  error?: string;
  lang: Locale;
}

export function BookingsClientPage({ initialBookings, error, lang }: BookingsClientPageProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };
  
  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'confirmed': return 'default';
        case 'pending': return 'secondary';
        case 'cancelled': return 'destructive';
        default: return 'outline';
    }
  }
  
  const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="flex justify-between py-3">
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="font-semibold text-right">{value}</dd>
    </div>
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
        <SheetContent className="sm:max-w-lg p-0">
          {selectedBooking && (
            <>
              <SheetHeader className="p-6">
                <SheetTitle className="text-2xl">Booking Details</SheetTitle>
                <SheetDescription>
                    ID: <span className="font-mono">{selectedBooking.id}</span>
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 space-y-4">
                 <dl className="divide-y divide-border">
                    <DetailRow label="Tour" value={selectedBooking.tour?.title?.[lang] || selectedBooking.tour?.title?.en} />
                    <DetailRow label="Date" value={format(new Date(selectedBooking.date), 'PPP')} />
                    <DetailRow label="Language" value={selectedBooking.language.toUpperCase()} />
                    <DetailRow label="Participants" value={selectedBooking.participants} />
                 </dl>

                <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Pickup Information</h4>
                    <p className="text-sm font-medium">{selectedBooking.hotelName}</p>
                    <p className="text-xs text-muted-foreground">Hotel</p>
                    <Separator className="my-2" />
                    <p className="text-sm font-medium">{selectedBooking.meetingPointName}</p>
                    <p className="text-xs text-muted-foreground">Meeting Point</p>
                </div>

                 <div className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Status</h4>
                    <div className="flex gap-4">
                        <div>
                             <p className="text-xs text-muted-foreground mb-1">Payment</p>
                             <Badge variant={getStatusVariant(selectedBooking.status)} className="capitalize">{selectedBooking.status}</Badge>
                        </div>
                         <div>
                             <p className="text-xs text-muted-foreground mb-1">Ticket</p>
                             <Badge variant={getStatusVariant(selectedBooking.ticketStatus)} className="capitalize">{selectedBooking.ticketStatus}</Badge>
                        </div>
                    </div>
                </div>
                 
                 <dl className="divide-y divide-border">
                    <DetailRow label="Total Price" value={`€${selectedBooking.totalPrice.toFixed(2)}`} />
                    <DetailRow label="Amount Paid" value={`€${selectedBooking.amountPaid.toFixed(2)}`} />
                    <DetailRow label="Amount Due" value={<span className="text-accent">€{selectedBooking.amountDue.toFixed(2)}</span>} />
                 </dl>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
