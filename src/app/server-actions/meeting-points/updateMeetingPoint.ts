
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';
import { updateMeetingPoint as updateMeetingPointUseCase } from '@/backend/meeting-points/application/updateMeetingPoint';
import { MeetingPoint } from '@/backend/meeting-points/domain/meeting-point.model';
import { z } from 'zod';
import { getCoordsFromUrl } from './utils/getCoordsFromUrl';
import { findMeetingPointById } from '@/backend/meeting-points/application/findMeetingPoints';

const meetingPointSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  region: z.enum(["North", "East", "South", "West", "Central"]).optional(),
  googleMapsUrl: z.string().url('Must be a valid URL').optional(),
});

type UpdateMeetingPointInput = Partial<Omit<MeetingPoint, 'id' | 'latitude' | 'longitude'>> & { id: string };

export const updateMeetingPoint = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: meetingPointSchema,
  },
  async (
    pointData: UpdateMeetingPointInput
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const meetingPointRepository = new FirestoreMeetingPointRepository();
      const dataToUpdate: Partial<MeetingPoint> & { id: string } = { ...pointData };
      
      // If the google maps url is being updated, we need to re-fetch the coordinates
      if (pointData.googleMapsUrl) {
          const currentPoint = await findMeetingPointById(meetingPointRepository, pointData.id);
          if (currentPoint?.googleMapsUrl !== pointData.googleMapsUrl) {
                const { latitude, longitude } = await getCoordsFromUrl(pointData.googleMapsUrl);
                dataToUpdate.latitude = latitude;
                dataToUpdate.longitude = longitude;
          }
      }

      await updateMeetingPointUseCase(meetingPointRepository, dataToUpdate);
      return { data: { success: true } };
    } catch (error: any) {
      return { error: error.message || 'Failed to update meeting point.' };
    }
  }
);

    