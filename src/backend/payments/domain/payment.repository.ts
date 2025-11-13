
import { Payment, PaymentStatus } from './payment.model';

export interface PaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByBookingId(bookingId: string): Promise<Payment | null>;
  findByPaymentIntentId(paymentIntentId: string): Promise<Payment | null>;
  save(payment: Payment): Promise<void>;
  updateStatus(id: string, status: PaymentStatus): Promise<void>;
}
