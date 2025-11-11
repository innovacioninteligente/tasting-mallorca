import { Booking, BookingStatus, TicketStatus } from './booking.model';

export interface BookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findAll(): Promise<Booking[]>;
  save(booking: Booking): Promise<Booking>;
  updateStatus(id: string, status: BookingStatus): Promise<void>;
  update(id: string, data: Partial<Booking>): Promise<void>;
}
