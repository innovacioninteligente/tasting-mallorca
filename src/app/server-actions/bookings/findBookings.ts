
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findBookingsByUserId, findAllBookings } from '@/backend/bookings/application/findBooking';
import { FirestoreBookingRepository } from '@/backend/bookings/infrastructure/firestore-booking.repository';
import { Booking, BookingWithDetails } from '@/backend/bookings/domain/booking.model';
import { FirestoreTourRepository } from '@/backend/tours/infrastructure/firestore-tour.repository';
import { findTourById } from '@/backend/tours/application/findTours';
import { FirestorePaymentRepository } from '@/backend/payments/infrastructure/firestore-payment.repository';
import { findPaymentByBookingId } from '@/backend/payments/application/findPayment';


export const findBookings = createSafeAction(
  {
    allowedRoles: ['admin', 'guide', 'customer'],
  },
  async (_: {}, user): Promise<{ data?: BookingWithDetails[]; error?: string }> => {
    if (!user) return { error: 'Authentication required' };
    
    try {
      const bookingRepository = new FirestoreBookingRepository();
      const tourRepository = new FirestoreTourRepository();
      const paymentRepository = new FirestorePaymentRepository();

      let bookings: Booking[];

      if (user.role === 'admin' || user.role === 'guide') {
        bookings = await findAllBookings(bookingRepository);
      } else {
        bookings = await findBookingsByUserId(bookingRepository, user.uid);
      }

      const detailedBookings = await Promise.all(
        bookings.map(async (booking) => {
          const tour = await findTourById(tourRepository, booking.tourId);
          const payment = await findPaymentByBookingId(paymentRepository, booking.id);
          
          const serializedBooking: BookingWithDetails = {
            ...booking,
            date: (booking.date as any).toDate ? (booking.date as any).toDate().toISOString() : booking.date,
            tour: tour ? JSON.parse(JSON.stringify(tour)) : undefined,
            payment: payment ? JSON.parse(JSON.stringify(payment)) : undefined,
          };
          return serializedBooking;
        })
      );
      
      return { data: JSON.parse(JSON.stringify(detailedBookings)) };
      
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch bookings.' };
    }
  }
);
