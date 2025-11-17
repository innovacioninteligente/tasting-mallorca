'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';

const CreatePendingBookingSchema = z.object({
  tourId: z.string(),
  userId: z.string(),
  date: z.date(),
  adults: z.number(),
  children: z.number(),
  infants: z.number(),
  language: z.string(),
  hotelId: z.string(),
  hotelName: z.string(),
  meetingPointId: z.string(),
  meetingPointName: z.string(),
  totalPrice: z.number(),
  paymentType: z.enum(['full', 'deposit']),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
});

type InputType = z.infer<typeof CreatePendingBookingSchema>;

export const createPendingBooking = createSafeAction(
  {
    inputSchema: CreatePendingBookingSchema,
  },
  async (data: InputType): Promise<{ data?: { bookingId: string }; error?: string }> => {
    try {
      const bookingRepository = new FirestoreBookingRepository();
      const newBookingId = crypto.randomUUID();

      const bookingData = {
        ...data,
        id: newBookingId,
        status: 'pending' as 'pending',
        ticketStatus: 'valid' as 'valid',
        amountPaid: 0,
        amountDue: data.totalPrice,
      };

      await bookingRepository.save(bookingData);

      return { data: { bookingId: newBookingId } };
    } catch (error: any) {
      console.error("Error creating pending booking:", error);
      return { error: 'Failed to create booking document in the backend.' };
    }
  }
);
