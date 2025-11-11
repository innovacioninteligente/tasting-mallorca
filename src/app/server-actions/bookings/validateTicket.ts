
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';
import { z } from 'zod';

const validateTicketSchema = z.object({
  bookingId: z.string(),
});

export const validateTicket = createSafeAction(
  {
    allowedRoles: ['admin', 'guide'],
    inputSchema: validateTicketSchema,
  },
  async ({ bookingId }: { bookingId: string }): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const bookingRepository = new FirestoreBookingRepository();
      
      const booking = await bookingRepository.findById(bookingId);
      if (!booking) {
        return { error: 'Booking not found.' };
      }
      
      if (booking.ticketStatus === 'redeemed') {
        return { error: 'Ticket has already been redeemed.' };
      }

      if (booking.ticketStatus === 'expired') {
        return { error: 'This ticket has expired.' };
      }
      
      await bookingRepository.update(bookingId, { ticketStatus: 'redeemed' });

      return { data: { success: true } };
    } catch (error: any) {
      return { error: error.message || 'Failed to validate ticket.' };
    }
  }
);
