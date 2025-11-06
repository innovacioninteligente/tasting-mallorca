import { BookingStatus } from '../domain/booking.model';
import { BookingRepository } from '../domain/booking.repository';

export async function updateBookingStatus(
  bookingRepository: BookingRepository,
  id: string,
  status: BookingStatus
): Promise<void> {
  await bookingRepository.updateStatus(id, status);
}
