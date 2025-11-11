
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { updateHotel as updateHotelUseCase } from '@/backend/hotels/application/updateHotel';
import { Hotel } from '@/backend/hotels/domain/hotel.model';
import { z } from 'zod';

const hotelSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  region: z.enum(["North", "East", "South", "West", "Central"]).optional(),
  subRegion: z.string().min(1, 'Sub-region is required').optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

type UpdateHotelInput = Partial<Omit<Hotel, 'id'>> & { id: string };

export const updateHotel = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: hotelSchema,
  },
  async (
    hotelData: UpdateHotelInput
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const hotelRepository = new FirestoreHotelRepository();
      await updateHotelUseCase(hotelRepository, hotelData);
      return { data: { success: true } };
    } catch (error: any) {
      return { error: error.message || 'Failed to update hotel.' };
    }
  }
);

    