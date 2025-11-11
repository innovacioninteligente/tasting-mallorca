
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findBookingById as findBookingByIdUseCase } from '@/backend/bookings/application/findBooking';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';
import { Booking } from '@/backend/bookings/domain/booking.model';
import { Tour } from '@/backend/tours/domain/tour.model';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { findTourById } from '@/backend/tours/application/findTours';


interface BookingDetails extends Booking {
    tour?: Tour;
}

export const findBookingById = createSafeAction(
  {
    allowedRoles: ['admin', 'guide'],
  },
  async (bookingId: string): Promise<{ data?: BookingDetails; error?: string }> => {
    try {
      const bookingRepository = new FirestoreBookingRepository();
      const tourRepository = new FirestoreTourRepository();

      const booking = await findBookingByIdUseCase(bookingRepository, bookingId);
      
      if (!booking) {
        return { error: 'Booking not found.' };
      }
      
      let bookingDetails: any = { ...booking };

      // Convert Firestore Timestamp to ISO string for client-side compatibility
      if (bookingDetails.date && typeof bookingDetails.date.toDate === 'function') {
        bookingDetails.date = bookingDetails.date.toDate().toISOString();
      }

      const tour = await findTourById(tourRepository, booking.tourId);
      if (tour) {
        bookingDetails.tour = JSON.parse(JSON.stringify(tour));
      }
      
      return { data: bookingDetails };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch booking.' };
    }
  }
);
