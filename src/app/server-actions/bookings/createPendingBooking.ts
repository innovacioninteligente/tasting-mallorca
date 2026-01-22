'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';

const CreatePendingBookingSchema = z.object({
  tourId: z.string(),
  userId: z.string(),
  date: z.date(),
  adults: z.number(),
  children: z.number(),
  infants: z.number(),
  language: z.string(),
  hotelId: z.string().optional().nullable(),
  hotelName: z.string().optional().nullable(),
  meetingPointId: z.string(),
  meetingPointName: z.string(),
  totalPrice: z.number(),
  paymentType: z.enum(['full', 'deposit']),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  customerLatitude: z.number().optional(),
  customerLongitude: z.number().optional(),
});

type InputType = z.infer<typeof CreatePendingBookingSchema>;

export const createPendingBooking = createSafeAction(
  {
    inputSchema: CreatePendingBookingSchema,
  },
  async (data: InputType): Promise<{ data?: { bookingId: string }; error?: string }> => {
    try {
      const bookingRepository = new FirestoreBookingRepository();
      const tourRepository = new FirestoreTourRepository();

      const tour = await tourRepository.findById(data.tourId);
      if (!tour) {
        return { error: 'Tour not found.' };
      }

      // Recalculate prices to ensure accuracy and apply promotions
      const adultPrice = tour.hasPromotion && tour.promotionPercentage > 0
        ? Math.round(tour.price * (1 - tour.promotionPercentage / 100))
        : tour.price;

      // Ensure childPrice is treated safely (default to 0 if undefined/null though model implies it exists)
      const baseChildPrice = tour.childPrice || 0;
      const childPrice = tour.hasPromotion && tour.promotionPercentage > 0
        ? Math.round(baseChildPrice * (1 - tour.promotionPercentage / 100))
        : baseChildPrice;

      const calculatedTotalPrice = (adultPrice * data.adults) + (childPrice * data.children);

      const newBookingId = crypto.randomUUID();

      const bookingData = {
        ...data,
        id: newBookingId,
        totalPrice: calculatedTotalPrice, // Override client-provided total
        status: 'pending' as 'pending',
        ticketStatus: 'valid' as 'valid',
        amountPaid: 0,
        amountDue: calculatedTotalPrice,
      };

      await bookingRepository.save(bookingData);

      return { data: { bookingId: newBookingId } };
    } catch (error: any) {
      console.error("Error creating pending booking:", error);
      return { error: 'Failed to create booking document in the backend.' };
    }
  }
);
