import { Payment } from '../domain/payment.model';
import { PaymentRepository } from '../domain/payment.repository';

export async function createPaymentRecord(
  paymentRepository: PaymentRepository,
  paymentData: Omit<Payment, 'id'>
): Promise<void> {
  const newPayment: Payment = {
    id: crypto.randomUUID(),
    ...paymentData,
  };
  await paymentRepository.save(newPayment);
}
