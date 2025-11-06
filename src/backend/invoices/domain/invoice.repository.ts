import { Invoice } from './invoice.model';

export interface InvoiceRepository {
  findById(id: string): Promise<Invoice | null>;
  findByBookingId(bookingId: string): Promise<Invoice | null>;
  save(invoice: Invoice): Promise<void>;
}
