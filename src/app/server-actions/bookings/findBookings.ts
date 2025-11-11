
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findBookingsByUserId, findAllBookings } from '@/backend/bookings/application/findBooking';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';
import { Booking } from '@/backend/bookings/domain/booking.model';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { findTourById } from '@/backend/tours/application/findTours';
import { Tour } from '@/backend/tours/domain/tour.model';

export const findBookings = createSafeAction(
  {
    allowedRoles: ['admin', 'guide', 'customer'],
  },
  async (_: {}, user): Promise<{ data?: Booking[]; error?: string }> => {
    if (!user) return { error: 'Authentication required' };
    
    try {
      const bookingRepository = new FirestoreBookingRepository();
      const tourRepository = new FirestoreTourRepository();

      let bookings: Booking[];

      if (user.role === 'admin' || user.role === 'guide') {
        bookings = await findAllBookings(bookingRepository);
      } else {
        bookings = await findBookingsByUserId(bookingRepository, user.uid);
      }

      const detailedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const tour = await findTourById(tourRepository, booking.tourId);
          return {
            ...booking,
            tour, // Attach the full tour object
          };
        })
      );
      
      // Serialize for client components
      return { data: JSON.parse(JSON.stringify(detailedBookings)) };
      
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch bookings.' };
    }
  }
);
