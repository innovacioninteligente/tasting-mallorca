
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { deleteHotel as deleteHotelUseCase } from '@/backend/hotels/application/deleteHotel';

export const deleteHotel = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (hotelId: string): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const hotelRepository = new FirestoreHotelRepository();
      await deleteHotelUseCase(hotelRepository, hotelId);
      return { data: { success: true } };
    } catch (error: any) {
      return { error: error.message || 'Failed to delete hotel.' };
    }
  }
);

    