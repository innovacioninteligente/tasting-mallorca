
'use server';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Map } from 'lucide-react';
import Link from 'next/link';
import { RouteMap } from '@/components/route-map';
import { notFound } from 'next/navigation';
import { getFirestore } from 'firebase-admin/firestore';
import { Booking } from '@/backend/bookings/domain/booking.model';
import { Tour } from '@/backend/tours/domain/tour.model';
import { Hotel } from '@/backend/hotels/domain/hotel.model';
import { MeetingPoint } from '@/backend/meeting-points/domain/meeting-point.model';
import { format } from 'date-fns';
import { es, fr, de, nl } from 'date-fns/locale';

interface SearchParams {
    payment_intent: string;
    lang: string;
}

const locales: { [key: string]: Locale } = { es, fr, de, nl };

async function getBookingData(paymentIntentId: string) {
    try {
        const db = getFirestore();
        
        // Find payment by stripePaymentIntentId
        const paymentsSnapshot = await db.collection('payments').where('stripePaymentIntentId', '==', paymentIntentId).limit(1).get();
        if (paymentsSnapshot.empty) {
            console.warn(`No payment found for intent ID: ${paymentIntentId}`);
            return null;
        }
        const payment = paymentsSnapshot.docs[0].data();

        // Get booking
        const bookingSnapshot = await db.collection('bookings').doc(payment.bookingId).get();
        if (!bookingSnapshot.exists) {
            console.warn(`No booking found for ID: ${payment.bookingId}`);
            return null;
        }
        const booking = bookingSnapshot.data() as Booking;

        // Get tour
        const tourSnapshot = await db.collection('tours').doc(booking.tourId).get();
        const tour = tourSnapshot.exists ? tourSnapshot.data() as Tour : null;

        // Get hotel and meeting point
        const hotelSnapshot = await db.collection('hotels').doc(booking.hotelId).get();
        const hotel = hotelSnapshot.exists ? hotelSnapshot.data() as Hotel : null;
        
        const meetingPointSnapshot = await db.collection('meetingPoints').doc(booking.meetingPointId).get();
        const meetingPoint = meetingPointSnapshot.exists ? meetingPointSnapshot.data() as MeetingPoint : null;

        return { booking, tour, hotel, meetingPoint };

    } catch (error) {
        console.error("Error fetching booking data:", error);
        return null;
    }
}


export default async function BookingSuccessPage({ searchParams, params }: { searchParams: SearchParams, params: { lang: string } }) {
    const { payment_intent } = searchParams;

    if (!payment_intent) {
        return notFound();
    }

    const data = await getBookingData(payment_intent);

    if (!data) {
        return (
             <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-12">
                <Card className="w-full max-w-md mx-4 text-center">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Could not retrieve booking details. Please check your email for confirmation or contact support.</p>
                        <Button asChild className="mt-4">
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const { booking, tour, hotel, meetingPoint } = data;
    const locale = locales[params.lang] || undefined;
    const formattedDate = booking.date ? format(new Date((booking.date as any).seconds * 1000), "PPP", { locale }) : 'N/A';
    
    const tourTitle = tour?.title[params.lang] || tour?.title.en || 'Tour';


    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading confirmation...</div>}>
            <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-12">
                <div className="container mx-auto px-4 w-full md:w-[70vw] lg:w-[60vw] xl:w-[50vw]">
                    <Card className="shadow-2xl border-primary/20">
                        <CardHeader className="text-center bg-secondary/30 rounded-t-lg pt-8">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <CardTitle className="text-3xl md:text-4xl font-extrabold text-primary">Booking Confirmed!</CardTitle>
                            <p className="text-muted-foreground text-lg mt-2">Thank you for trusting Tasting Mallorca.</p>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6 text-base">
                            <p className="text-center text-muted-foreground">
                                We have sent a confirmation email with all the details of your reservation. Please check your inbox.
                            </p>
                            <div className="border border-border bg-secondary/30 rounded-lg p-4 space-y-3">
                                <h3 className="font-bold text-xl mb-2 text-foreground">Summary of your Adventure</h3>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tour:</span>
                                    <span className="font-semibold text-right">{tourTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-semibold">{formattedDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Participants:</span>
                                    <span className="font-semibold">{booking.participants}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Client:</span>
                                    <span className="font-semibold">{hotel?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Your hotel:</span>
                                    <span className="font-semibold text-right">{booking.hotelName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Meeting Point:</span>
                                    <span className="font-semibold text-right">{booking.meetingPointName}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t mt-3">
                                    <span className="text-foreground">Total Paid:</span>
                                    <span className="text-primary">€{booking.totalPrice}</span>
                                </div>
                            </div>

                            {hotel?.address && meetingPoint?.address && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-xl flex items-center gap-2">
                                        <Map className="w-6 h-6 text-primary"/>
                                        Route to your meeting point
                                    </h3>
                                    <div className="h-96 rounded-lg overflow-hidden border border-border">
                                        <RouteMap
                                            originAddress={hotel.address}
                                            destinationAddress={meetingPoint.address}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button asChild size="lg" className="w-full font-bold text-lg mt-6">
                            <Link href="/">
                                <Home className="mr-2 h-5 w-5" />
                                Go to Homepage
                            </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Suspense>
    );
}
