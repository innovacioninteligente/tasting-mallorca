'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { cancelBookingUseCase } from '@/backend/bookings/application/cancelBooking';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';

const cancelBookingSchema = z.object({
  bookingId: z.string(),
});

// This is a public action for now, as we don't have session-based auth for non-logged-in users.
// In the future, this would be protected by a temporary access token.
export const cancelBooking = createSafeAction(
  {
    inputSchema: cancelBookingSchema,
  },
  async ({ bookingId }: { bookingId: string }): Promise<{ data?: { success: boolean }; error?: string }> => {
    try {
      const bookingRepository = new FirestoreBookingRepository();
      const result = await cancelBookingUseCase(bookingRepository, bookingId);
      
      if (!result.success) {
        return { error: result.error };
      }

      return { data: { success: true } };

    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      return { error: error.message || 'Failed to cancel booking.' };
    }
  }
);
