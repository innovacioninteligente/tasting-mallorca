

'use server';

import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Map, DollarSign, QrCode } from 'lucide-react';
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

interface SearchParams {
    payment_intent: string;
    lang: string;
}

const locales: { [key: string]: Locale } = { es, fr, de, nl };

async function getBookingData(paymentIntentId: string) {
    try {
        const db = getFirestore();
        
        const paymentsSnapshot = await db.collection('payments').where('stripePaymentIntentId', '==', paymentIntentId).limit(1).get();
        if (paymentsSnapshot.empty) {
            console.warn(`No payment found for intent ID: ${paymentIntentId}`);
            return null;
        }
        const payment = paymentsSnapshot.docs[0].data();

        const bookingSnapshot = await db.collection('bookings').doc(payment.bookingId).get();
        if (!bookingSnapshot.exists) {
            console.warn(`No booking found for ID: ${payment.bookingId}`);
            return null;
        }
        const booking = bookingSnapshot.data() as Booking;

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
                            <Link href={`/${params.lang}`}>Go to Homepage</Link>
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
    const isDeposit = booking.paymentType === 'deposit';

    const originCoords = (hotel?.latitude && hotel?.longitude) ? { lat: hotel.latitude, lng: hotel.longitude } : null;
    const destinationCoords = (meetingPoint?.latitude && meetingPoint?.longitude) ? { lat: meetingPoint.latitude, lng: meetingPoint.longitude } : null;

    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading confirmation...</div>}>
            <div className="bg-background text-foreground min-h-screen flex items-center justify-center py-12">
                <div className="container mx-auto px-4 w-full md:w-[70vw] lg:w-[60vw] xl:w-[50vw]">
                    <Card className="shadow-2xl border-primary/20">
                        <CardHeader className="text-center bg-secondary/30 rounded-t-lg pt-8">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <CardTitle className="text-3xl md:text-4xl font-extrabold text-primary">
                                {isDeposit ? "¡Reserva con Depósito Confirmada!" : "¡Reserva Confirmada!"}
                            </CardTitle>
                            <p className="text-muted-foreground text-lg mt-2">Gracias por confiar en Tasting Mallorca.</p>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6 text-base">
                            <p className="text-center text-muted-foreground">
                                Hemos enviado un correo de confirmación con todos los detalles de tu reserva. Por favor, revisa tu bandeja de entrada.
                            </p>
                            
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <QrCode className="h-6 w-6"/>
                                        Tu Ticket Digital
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
                                        Presenta este código QR a tu guía al subir al autobús. Este es tu ticket personal e intransferible.
                                    </p>
                                </CardContent>
                            </Card>

                            <div className="border border-border bg-secondary/30 rounded-lg p-4 space-y-3">
                                <h3 className="font-bold text-xl mb-2 text-foreground">Resumen de tu Aventura</h3>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tour:</span>
                                    <span className="font-semibold text-right">{tourTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Fecha:</span>
                                    <span className="font-semibold">{formattedDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Participantes:</span>
                                    <span className="font-semibold">{booking.participants}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tu hotel:</span>
                                    <span className="font-semibold text-right">{booking.hotelName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Punto de Encuentro:</span>
                                    <span className="font-semibold text-right">{booking.meetingPointName}</span>
                                </div>
                            </div>
                            
                             <div className="border border-border bg-secondary/30 rounded-lg p-4 space-y-3">
                                <h3 className="font-bold text-xl mb-2 text-foreground flex items-center gap-2">
                                    <DollarSign className="w-6 h-6"/>
                                    Resumen del Pago
                                </h3>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Precio Total del Tour:</span>
                                    <span className="font-semibold">€{booking.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Importe Pagado:</span>
                                    <span className="font-semibold text-green-600">€{booking.amountPaid.toFixed(2)}</span>
                                </div>
                                {isDeposit && (
                                     <div className="flex justify-between text-lg font-bold pt-3 border-t mt-3 text-accent">
                                        <span>Pendiente de pago (el día del tour):</span>
                                        <span>€{booking.amountDue.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {originCoords && destinationCoords && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-xl flex items-center gap-2">
                                        <Map className="w-6 h-6 text-primary"/>
                                        Ruta a tu punto de encuentro
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
                                Ir a la Página Principal
                            </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Suspense>
    );
}
