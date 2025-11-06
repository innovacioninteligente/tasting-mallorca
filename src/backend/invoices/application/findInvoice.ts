import { Invoice } from '../domain/invoice.model';
import { InvoiceRepository } from '../domain/invoice.repository';

export async function findInvoiceByBookingId(
  invoiceRepository: InvoiceRepository,
  bookingId: string
): Promise<Invoice | null> {
  return invoiceRepository.findByBookingId(bookingId);
}
