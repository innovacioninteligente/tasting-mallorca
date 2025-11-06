import { Booking, BookingStatus } from './booking.model';

export interface BookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  save(booking: Booking): Promise<Booking>;
  updateStatus(id: string, status: BookingStatus): Promise<void>;
}
