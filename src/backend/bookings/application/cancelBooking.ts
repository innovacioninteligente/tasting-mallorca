import { BookingRepository } from '../domain/booking.repository';
import { findBookingById } from './findBooking';
import { differenceInHours } from 'date-fns';
// Assume Stripe refund logic will be here in the future
// import { refundPayment } from '@/app/actions/stripe';

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

  // TODO: Integrate Stripe refund logic
  // const payment = await findPaymentByBookingId(booking.id);
  // if (payment) {
  //   await refundPayment(payment.stripePaymentIntentId);
  // }

  await bookingRepository.update(bookingId, { 
      status: 'cancelled',
      ticketStatus: 'expired'
  });

  return { success: true };
}
