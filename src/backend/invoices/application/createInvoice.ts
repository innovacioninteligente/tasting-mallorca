import { Invoice } from '../domain/invoice.model';
import { InvoiceRepository } from '../domain/invoice.repository';
import { Booking } from '@/backend/bookings/domain/booking.model';
import { Tour } from '@/backend/tours/domain/tour.model';

export async function createInvoice(
  invoiceRepository: InvoiceRepository,
  booking: Booking,
  tour: Tour
): Promise<void> {
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    bookingId: booking.id,
    userId: booking.userId,
    issueDate: new Date(),
    details: {
      tourTitle: tour.title,
      bookingDate: booking.date,
      participants: booking.participants,
      pricePerParticipant: tour.price,
      totalAmount: booking.totalPrice,
    },
    // pdfUrl will be generated and updated later
  };

  await invoiceRepository.save(invoice);
}
