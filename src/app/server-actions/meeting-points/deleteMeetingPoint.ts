
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';
import { deleteMeetingPoint as deleteMeetingPointUseCase } from '@/backend/meeting-points/application/deleteMeetingPoint';

export const deleteMeetingPoint = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (pointId: string): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const meetingPointRepository = new FirestoreMeetingPointRepository();
      await deleteMeetingPointUseCase(meetingPointRepository, pointId);
      return { data: { success: true } };
    } catch (error: any) {
      return { error: error.message || 'Failed to delete meeting point.' };
    }
  }
);

    