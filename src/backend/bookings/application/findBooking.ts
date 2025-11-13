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

export async function findAllBookings(
    bookingRepository: BookingRepository
): Promise<Booking[]> {
    return bookingRepository.findAll();
}

export async function findBookingByIdAndEmail(
  bookingRepository: BookingRepository,
  id: string,
  email: string,
): Promise<Booking | null> {
  const booking = await bookingRepository.findById(id);
  if (booking && booking.customerEmail.toLowerCase() === email.toLowerCase()) {
    return booking;
  }
  return null;
}
