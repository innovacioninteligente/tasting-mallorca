
import { Payment } from '../domain/payment.model';
import { PaymentRepository } from '../domain/payment.repository';

export async function findPaymentByIntentId(
  paymentRepository: PaymentRepository,
  paymentIntentId: string
): Promise<Payment | null> {
  return paymentRepository.findByPaymentIntentId(paymentIntentId);
}

export async function findPaymentByBookingId(
  paymentRepository: PaymentRepository,
  bookingId: string
): Promise<Payment | null> {
    return paymentRepository.findByBookingId(bookingId);
}
