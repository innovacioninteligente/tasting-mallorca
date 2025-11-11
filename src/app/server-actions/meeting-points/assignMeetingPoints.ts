
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { assignMeetingPointToHotels } from '@/backend/hotels/application/assignMeetingPointToHotels';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';

export const assignMeetingPoints = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (_: {}): Promise<{ data?: { updatedCount: number }; error?: string }> => {
    try {
        const hotelRepository = new FirestoreHotelRepository();
        const meetingPointRepository = new FirestoreMeetingPointRepository();

        const result = await assignMeetingPointToHotels(hotelRepository, meetingPointRepository);

        if (!result.success) {
            return { error: result.error || 'An unknown error occurred during assignment.' };
        }

        return { data: { updatedCount: result.updatedCount } };
    } catch (error: any) {
      return { error: error.message || 'Failed to assign meeting points.' };
    }
  }
);

    