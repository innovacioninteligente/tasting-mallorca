
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findAllHotels as findAllHotelsUseCase, findHotelById as findHotelByIdUseCase } from '@/backend/hotels/application/findHotels';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { Hotel } from '@/backend/hotels/domain/hotel.model';

export const findHotelById = createSafeAction(
    {
        allowedRoles: ['admin'],
    },
    async (hotelId: string): Promise<{ data?: Hotel; error?: string }> => {
        try {
            const hotelRepository = new FirestoreHotelRepository();
            const hotel = await findHotelByIdUseCase(hotelRepository, hotelId);
            if (!hotel) {
                return { error: 'Hotel not found.' };
            }
            return { data: JSON.parse(JSON.stringify(hotel)) };
        } catch (error: any) {
            return { error: error.message || 'Failed to fetch hotel.' };
        }
    }
);

export const findAllHotels = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (_: {}): Promise<{ data?: Hotel[]; error?: string }> => {
    try {
      const hotelRepository = new FirestoreHotelRepository();
      const hotels = await findAllHotelsUseCase(hotelRepository);
      return { data: JSON.parse(JSON.stringify(hotels)) };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch hotels.' };
    }
  }
);

    