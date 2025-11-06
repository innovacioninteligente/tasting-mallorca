import { Booking } from '../domain/booking.model';
import { BookingRepository } from '../domain/booking.repository';

export async function findBookingById(
  bookingRepository: BookingRepository,
  id: string
): Promise<Booking | null> {
  return bookingRepository.findById(id);
}

export async function findBookingsByUserId(
  bookingRepository: BookingRepository,
  userId: string
): Promise<Booking[]> {
  return bookingRepository.findByUserId(userId);
}
