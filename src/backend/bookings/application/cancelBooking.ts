
'use server';

import { BookingRepository } from '../domain/booking.repository';
import { findBookingById } from './findBooking';
import { differenceInHours } from 'date-fns';
import { FirestorePaymentRepository } from '@/backend/payments/infrastructure/firestore-payment.repository';
import { findPaymentByBookingId } from '@/backend/payments/application/findPayment';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function cancelBookingUseCase(
  bookingRepository: BookingRepository,
  bookingId: string
): Promise<{ success: boolean, error?: string }> {
  const booking = await findBookingById(bookingRepository, bookingId);

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  if (booking.status === 'cancelled') {
    return { success: false, error: 'Booking has already been cancelled.' };
  }

  const bookingDate = (booking.date as any).toDate ? (booking.date as any).toDate() : new Date(booking.date);
  if (differenceInHours(bookingDate, new Date()) < 24) {
    return { success: false, error: 'The cancellation deadline of 24 hours has passed.' };
  }

  const paymentRepository = new FirestorePaymentRepository();
  const payment = await findPaymentByBookingId(paymentRepository, bookingId);

  if (!payment || !payment.stripePaymentIntentId) {
      // If there's no payment record, we can just cancel the booking without a refund.
      // This might happen for bookings that were never paid.
      await bookingRepository.update(bookingId, { 
          status: 'cancelled',
          ticketStatus: 'expired'
      });
      return { success: true };
  }
  
  try {
    // Create a refund in Stripe
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

    // If refund is successful, update our database
    await bookingRepository.update(bookingId, { 
        status: 'cancelled',
        ticketStatus: 'expired',
        amountPaid: 0,
        amountDue: 0,
    });
    
    return { success: true };

  } catch (error: any) {
    console.error("Stripe refund failed:", error);
    // Return a user-friendly error message
    if (error.code === 'charge_already_refunded') {
        // If already refunded in Stripe, just update our DB state.
        await bookingRepository.update(bookingId, { status: 'cancelled', ticketStatus: 'expired' });
        return { success: true };
    }
    return { success: false, error: error.message || "An error occurred while processing the refund." };
  }
}
