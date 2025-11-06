import { Booking, BookingStatus } from '../domain/booking.model';
import { BookingRepository } from '../domain/booking.repository';
import { Tour } from '@/backend/tours/domain/tour.model';

type CreateBookingInput = {
  tourId: string;
  userId: string;
  date: Date;
  participants: number;
};

export async function createBooking(
  bookingRepository: BookingRepository,
  tour: Tour,
  input: CreateBookingInput
): Promise<Booking> {
  const booking: Booking = {
    id: crypto.randomUUID(),
    tourId: input.tourId,
    userId: input.userId,
    date: input.date,
    participants: input.participants,
    totalPrice: tour.price * input.participants,
    status: 'pending',
    paymentId: '', // Will be updated after payment intent is created
  };

  return bookingRepository.save(booking);
}
