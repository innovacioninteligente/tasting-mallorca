
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findAllMeetingPoints as findAllMeetingPointsUseCase, findMeetingPointById as findMeetingPointByIdUseCase } from '@/backend/meeting-points/application/findMeetingPoints';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';
import { MeetingPoint } from '@/backend/meeting-points/domain/meeting-point.model';

export const findMeetingPointById = createSafeAction(
    {
        allowedRoles: ['admin'],
    },
    async (pointId: string): Promise<{ data?: MeetingPoint; error?: string }> => {
        try {
            const meetingPointRepository = new FirestoreMeetingPointRepository();
            const meetingPoint = await findMeetingPointByIdUseCase(meetingPointRepository, pointId);
            if (!meetingPoint) {
                return { error: 'Meeting Point not found.' };
            }
            return { data: JSON.parse(JSON.stringify(meetingPoint)) };
        } catch (error: any) {
            return { error: error.message || 'Failed to fetch meeting point.' };
        }
    }
);

export const findAllMeetingPoints = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (_: {}): Promise<{ data?: MeetingPoint[]; error?: string }> => {
    try {
      const meetingPointRepository = new FirestoreMeetingPointRepository();
      const meetingPoints = await findAllMeetingPointsUseCase(meetingPointRepository);
      return { data: JSON.parse(JSON.stringify(meetingPoints)) };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch meeting points.' };
    }
  }
);

    