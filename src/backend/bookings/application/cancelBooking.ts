import { BookingRepository } from '../domain/booking.repository';
import { findBookingById } from './findBooking';
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

  // TODO: Add logic to check if the booking is within the cancellable period (e.g., > 24 hours before tour date)

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
