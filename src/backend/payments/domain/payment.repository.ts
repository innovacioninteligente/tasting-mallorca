
import { Payment, PaymentStatus } from './payment.model';

export interface PaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByBookingId(bookingId: string): Promise<Payment | null>;
  findByPaymentIntentId(paymentIntentId: string): Promise<Payment | null>;
  save(payment: Payment): Promise<void>;
  update(id: string, data: Partial<Payment>): Promise<void>;
}
