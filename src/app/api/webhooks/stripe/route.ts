

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminApp } from '@/firebase/server/config';
import { getFirestore } from 'firebase-admin/firestore';
import { Booking } from '@/backend/bookings/domain/booking.model';
import { Payment, PaymentStatus } from '@/backend/payments/domain/payment.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');
    const body = await req.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    adminApp;
    const db = getFirestore();

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('✅ PaymentIntent was successful!');

            try {
                const metadata = paymentIntent.metadata;

                const amountPaid = paymentIntent.amount / 100;
                const totalPrice = parseFloat(metadata.totalPrice);
                const amountDue = totalPrice - amountPaid;

                const bookingData: Booking = {
                    id: crypto.randomUUID(),
                    tourId: metadata.tourId,
                    userId: metadata.userId,
                    date: new Date(metadata.bookingDate),
                    participants: parseInt(metadata.participants, 10),
                    language: metadata.language,
                    hotelId: metadata.hotelId,
                    hotelName: metadata.hotelName,
                    meetingPointId: metadata.meetingPointId,
                    meetingPointName: metadata.meetingPointName,
                    totalPrice: totalPrice,
                    amountPaid: amountPaid,
                    amountDue: amountDue,
                    paymentType: metadata.paymentType as 'deposit' | 'full',
                    status: 'confirmed',
                };

                await db.collection('bookings').doc(bookingData.id).set(bookingData);
                
                const paymentData: Omit<Payment, 'id'> = {
                    bookingId: bookingData.id,
                    stripePaymentIntentId: paymentIntent.id,
                    amount: amountPaid,
                    currency: paymentIntent.currency,
                    status: paymentIntent.status as PaymentStatus,
                };
                await db.collection('payments').add(paymentData);

                console.log(`✅ Successfully created booking ${bookingData.id} and payment record.`);
            
            } catch (error) {
                console.error("❌ Error processing successful payment:", error);
                return NextResponse.json({ error: 'Internal Server Error while processing payment.' }, { status: 500 });
            }

            break;
        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            console.log(`❌ PaymentIntent failed: ${paymentIntentFailed.id}`);
            break;
        default:
            console.log(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
