
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
      await bookingRepository.update(bookingId, { 
          status: 'cancelled',
          ticketStatus: 'expired'
      });
      return { success: true };
  }
  
  try {
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

    await bookingRepository.update(bookingId, { 
        status: 'cancelled',
        ticketStatus: 'expired',
        amountPaid: 0,
        amountDue: 0,
    });
    
    await paymentRepository.update(payment.id, {
        status: 'refunded',
        refundId: refund.id,
        refundedAmount: refund.amount,
        refundedAt: new Date(refund.created * 1000),
    });
    
    return { success: true };

  } catch (error: any) {
    console.error("Stripe refund failed:", error);
    
    if (error.code === 'charge_already_refunded') {
        await bookingRepository.update(bookingId, { status: 'cancelled', ticketStatus: 'expired' });
        await paymentRepository.update(payment.id, { status: 'refunded' });
        return { success: true };
    }
    
    await paymentRepository.update(payment.id, {
        status: 'failed',
        failureReason: error.message || 'Unknown refund error',
    });

    return { success: false, error: error.message || "An error occurred while processing the refund." };
  }
}
