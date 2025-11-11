
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { createHotel as createHotelUseCase } from '@/backend/hotels/application/createHotel';
import { Hotel } from '@/backend/hotels/domain/hotel.model';
import { z } from 'zod';

const hotelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().optional(),
  region: z.enum(["North", "East", "South", "West", "Central"]),
  subRegion: z.string().min(1, 'Sub-region is required'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

type CreateHotelInput = Omit<Hotel, 'id' | 'assignedMeetingPointId'>;

export const createHotel = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: hotelSchema,
  },
  async (
    hotelData: CreateHotelInput
  ): Promise<{ data?: { hotelId: string }; error?: string }> => {
    try {
      const hotelRepository = new FirestoreHotelRepository();
      const newHotel: Hotel = {
        id: crypto.randomUUID(),
        ...hotelData,
      };

      await createHotelUseCase(hotelRepository, newHotel);

      return { data: { hotelId: newHotel.id } };
    } catch (error: any) {
      return { error: error.message || 'Failed to create hotel.' };
    }
  }
);

    
    