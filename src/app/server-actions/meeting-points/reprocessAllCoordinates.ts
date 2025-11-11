
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';
import { reprocessCoordinatesForMissingPoints } from '@/backend/meeting-points/application/reprocessCoordinates';

export const reprocessAllCoordinates = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (_: {}): Promise<{ data?: { updatedCount: number }; error?: string }> => {
    try {
        const meetingPointRepository = new FirestoreMeetingPointRepository();
        
        const result = await reprocessCoordinatesForMissingPoints(meetingPointRepository);

        if (!result.success) {
            return { error: result.error || 'An unknown error occurred during reprocessing.' };
        }

        return { data: { updatedCount: result.updatedCount } };
    } catch (error: any) {
      return { error: error.message || 'Failed to reprocess coordinates.' };
    }
  }
);
