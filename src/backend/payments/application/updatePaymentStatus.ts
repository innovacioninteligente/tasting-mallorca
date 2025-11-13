import { Payment, PaymentStatus } from '../domain/payment.model';
import { PaymentRepository } from '../domain/payment.repository';

export async function updatePaymentStatus(
  paymentRepository: PaymentRepository,
  id: string,
  status: PaymentStatus
): Promise<void> {
  await paymentRepository.update(id, { status });
}
