'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { fr, de, nl, enUS, es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cancelBooking } from '@/app/server-actions/bookings/cancelBooking';
import { useRouter } from 'next/navigation';
import { Locale } from '@/dictionaries/config';

interface BookingDetailsClientPageProps {
    booking: any;
    lang: Locale;
}

const locales: { [key: string]: typeof enUS } = { en: enUS, fr, de, nl, es };

export function BookingDetailsClientPage({ booking: initialBooking, lang }: BookingDetailsClientPageProps) {
    const [booking, setBooking] = useState(initialBooking);
    const [isCancelling, setIsCancelling] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const locale = locales[lang] || enUS;
    
    const handleCancelBooking = async () => {
        setIsCancelling(true);
        try {
            const result = await cancelBooking({ bookingId: booking.id });
            if (result.error) {
                throw new Error(result.error);
            }
            toast({
                title: 'Booking Cancelled',
                description: 'Your booking has been successfully cancelled.',
            });
            // Update the local state to reflect the change
            setBooking({ ...booking, status: 'cancelled', ticketStatus: 'expired' });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Cancellation Failed',
                description: error.message,
            });
        } finally {
            setIsCancelling(false);
        }
    };
    
    const isCancellable = booking.status === 'confirmed';

    return (
        <div className="bg-secondary min-h-screen py-12">
            <Card className="w-full max-w-2xl mx-auto shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Booking Details</CardTitle>
                    <div className="text-sm text-muted-foreground pt-1">
                        Booking ID: <span className="font-mono">{booking.id}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-background rounded-lg border">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">{booking.tour.title[lang]}</h3>
                             <Badge variant={booking.status === 'cancelled' ? 'destructive' : 'default'} className="capitalize">{booking.status}</Badge>
                        </div>
                        <div className="mt-2 text-muted-foreground text-sm space-y-1">
                            <p><strong>Date:</strong> {format(new Date(booking.date), 'PPP', { locale })}</p>
                            <p><strong>Participants:</strong> {booking.adults} Adults, {booking.children} Children, {booking.infants} Infants</p>
                            <p><strong>Pickup:</strong> {booking.meetingPointName}</p>
                        </div>
                    </div>
                    
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Cancellation Policy</AlertTitle>
                        <AlertDescription>
                           You can cancel up to 24 hours in advance of the experience for a full refund.
                        </AlertDescription>
                    </Alert>

                </CardContent>
                <CardFooter className="bg-secondary/50 p-6 flex justify-end">
                    {isCancellable ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isCancelling}>
                                    {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                                    Cancel Booking
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently cancel your booking and process a refund according to the cancellation policy.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive hover:bg-destructive/90">
                                        Yes, Cancel Booking
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                         <p className="text-sm text-muted-foreground">This booking cannot be cancelled.</p>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
