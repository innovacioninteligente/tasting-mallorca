
'use server';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Map, DollarSign, QrCode, AlertTriangle } from 'lucide-react';
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
import QRCode from "react-qr-code";
import { adminApp } from '@/firebase/server/config';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Locale } from '@/dictionaries/config';

interface SearchParams {
    booking_id: string;
}

const locales: { [key: string]: Locale } = { es, fr, de, nl };

async function getBookingData(bookingId: string) {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1500; // 1.5 seconds

    try {
        adminApp; // Ensure Firebase Admin is initialized
        const db = getFirestore();
        
        for (let i = 0; i < MAX_RETRIES; i++) {
            const bookingSnapshot = await db.collection('bookings').doc(bookingId).get();

            if (bookingSnapshot.exists) {
                const booking = bookingSnapshot.data() as Booking;
                
                // If confirmed, we are good to go.
                if (booking.status === 'confirmed') {
                    return getFullBookingDetails(booking);
                }
            }
            // If it's not the last retry, wait before checking again.
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }

        // If after all retries it's still not confirmed, or doesn't exist
        console.warn(`Booking ${bookingId} was not found or not confirmed after ${MAX_RETRIES} retries.`);
        return null;

    } catch (error) {
        console.error("Error fetching booking data:", error);
        return null;
    }
}


async function getFullBookingDetails(booking: Booking) {
    const db = getFirestore();
    const tourSnapshot = await db.collection('tours').doc(booking.tourId).get();
    const tour = tourSnapshot.exists ? tourSnapshot.data() as Tour : null;
    
    let hotel: Hotel | null = null;
    if (booking.hotelId) {
        const hotelSnapshot = await db.collection('hotels').doc(booking.hotelId).get();
        hotel = hotelSnapshot.exists ? hotelSnapshot.data() as Hotel : null;
    }
    
    let meetingPoint: MeetingPoint | null = null;
    if (booking.meetingPointId) {
        const meetingPointSnapshot = await db.collection('meetingPoints').doc(booking.meetingPointId).get();
        meetingPoint = meetingPointSnapshot.exists ? meetingPointSnapshot.data() as MeetingPoint : null;
    }

    return { booking, tour, hotel, meetingPoint };
}


export default async function BookingSuccessPage({ searchParams, params }: { searchParams: SearchParams, params: { lang: Locale } }) {
    const { booking_id } = searchParams;
    const dictionary = await getDictionary(params.lang);
    const t = dictionary.bookingSuccess;

    if (!booking_id) {
        return notFound();
    }

    const data = await getBookingData(booking_id);

    if (!data) {
        return (
             <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-12">
                <Card className="w-full max-w-md mx-4 text-center">
                    <CardHeader>
                        <CardTitle>{t.errorTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{t.errorMessage}</p>
                        <Button asChild className="mt-4">
                            <Link href={`/${params.lang}`}>{t.goToHomepage}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const { booking, tour, hotel, meetingPoint } = data;
    const locale = locales[params.lang] || undefined;
    const bookingDate = (booking.date as any).toDate ? (booking.date as any).toDate() : new Date(booking.date);
    const formattedDate = format(bookingDate, "PPP", { locale });
    
    const tourTitle = tour?.title[params.lang] || tour?.title.en || 'Tour';
    const isDeposit = booking.paymentType === 'deposit';

    const originCoords = (hotel?.latitude && hotel?.longitude) ? { lat: hotel.latitude, lng: hotel.longitude } : null;
    const destinationCoords = (meetingPoint?.latitude && meetingPoint?.longitude) ? { lat: meetingPoint.latitude, lng: meetingPoint.longitude } : null;

    const totalParticipants = booking.adults + booking.children + booking.infants;

    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading confirmation...</div>}>
            <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-12">
                <div className="container mx-auto px-4 w-full md:w-[70vw] lg:w-[60vw] xl:w-[50vw]">
                    <Card className="shadow-2xl border-primary/20">
                        <CardHeader className="text-center bg-secondary/30 rounded-t-lg pt-8">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <CardTitle className="text-3xl md:text-4xl font-extrabold text-primary">
                                {isDeposit ? t.titleDepositConfirmed : t.titleConfirmed}
                            </CardTitle>
                            <p className="text-muted-foreground text-lg mt-2">{t.thankYou}</p>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6 text-base">
                            <p className="text-center text-muted-foreground">
                                {t.confirmationEmail}
                            </p>
                            
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <QrCode className="h-6 w-6"/>
                                        {t.yourDigitalTicket}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 p-6">
                                    <div className="bg-white p-4 rounded-lg border">
                                        <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "160px" }}
                                            value={booking.id}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                    <p className="text-muted-foreground text-center md:text-left max-w-xs">
                                        {t.qrCodeInstruction}
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="border border-border bg-secondary/30 rounded-lg p-4 space-y-3">
                                <h3 className="font-bold text-xl mb-2 text-foreground">{t.adventureSummary}</h3>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.tour}</span>
                                    <span className="font-semibold text-right">{tourTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.date}</span>
                                    <span className="font-semibold">{formattedDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.participants}</span>
                                    <span className="font-semibold">{totalParticipants} ({booking.adults} Adults, {booking.children} Children, {booking.infants} Infants)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.yourHotel}</span>
                                    <span className="font-semibold text-right">{booking.hotelName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.meetingPoint}</span>
                                    <span className="font-semibold text-right">{booking.meetingPointName}</span>
                                </div>
                            </div>
                            
                             <div className="border border-border bg-secondary/30 rounded-lg p-4 space-y-3">
                                <h3 className="font-bold text-xl mb-2 text-foreground flex items-center gap-2">
                                    <DollarSign className="w-6 h-6"/>
                                    {t.paymentSummary}
                                </h3>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.totalPrice}</span>
                                    <span className="font-semibold">€{booking.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.amountPaid}</span>
                                    <span className="font-semibold text-green-600">€{booking.amountPaid.toFixed(2)}</span>
                                </div>
                                {isDeposit && (
                                     <>
                                        <div className="flex justify-between text-lg font-bold pt-3 border-t mt-3 text-accent">
                                            <span>{t.amountDue}</span>
                                            <span>€{booking.amountDue.toFixed(2)}</span>
                                        </div>
                                         <Alert variant="default" className="mt-2 text-sm bg-accent/10 border-accent/20 text-accent-foreground">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription>
                                                {dictionary.tourDetail.booking.depositReminder}
                                            </AlertDescription>
                                        </Alert>
                                    </>
                                )}
                            </div>

                            {originCoords && destinationCoords && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-xl flex items-center gap-2">
                                        <Map className="w-6 h-6 text-primary"/>
                                        {t.routeToMeetingPoint}
                                    </h3>
                                    <div className="h-96 rounded-lg overflow-hidden border border-border">
                                        <RouteMap
                                            origin={originCoords}
                                            destination={destinationCoords}
                                        />
                                    </div>
                                </div>
                            )}

                            <Button asChild size="lg" className="w-full font-bold text-lg mt-6">
                            <Link href={`/${params.lang}`}>
                                <Home className="mr-2 h-5 w-5" />
                                {t.goToMainPage}
                            </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Suspense>
    );
}
