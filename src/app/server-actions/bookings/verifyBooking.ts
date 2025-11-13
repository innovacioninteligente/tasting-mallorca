'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { findBookingByIdAndEmail } from '@/backend/bookings/application/findBooking';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';

const verifyBookingSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required.'),
  email: z.string().email('A valid email is required.'),
});

export const verifyBookingAction = createSafeAction(
  {
    inputSchema: verifyBookingSchema,
  },
  async (
    { bookingId, email }
  ): Promise<{ data?: { bookingId: string }; error?: string }> => {
    try {
      const bookingRepository = new FirestoreBookingRepository();
      const booking = await findBookingByIdAndEmail(bookingRepository, bookingId, email);

      if (!booking) {
        return { error: 'No matching booking found. Please check your details and try again.' };
      }

      // If found, we return the bookingId. The client will then redirect.
      // In a more secure system, we would generate and return a short-lived access token here.
      return { data: { bookingId: booking.id } };

    } catch (error: any) {
      console.error('Error verifying booking:', error);
      return { error: error.message || 'An unexpected error occurred during verification.' };
    }
  }
);
