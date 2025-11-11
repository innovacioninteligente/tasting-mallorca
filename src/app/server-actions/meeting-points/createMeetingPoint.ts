
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';
import { createMeetingPoint as createMeetingPointUseCase } from '@/backend/meeting-points/application/createMeetingPoint';
import { MeetingPoint } from '@/backend/meeting-points/domain/meeting-point.model';
import { z } from 'zod';
import { getCoordsFromUrl } from './utils/getCoordsFromUrl';

const meetingPointSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  region: z.enum(["North", "East", "South", "West", "Central"]),
  googleMapsUrl: z.string().url('Must be a valid URL'),
});

type CreateMeetingPointInput = Omit<MeetingPoint, 'id' | 'latitude' | 'longitude'>;

export const createMeetingPoint = createSafeAction(
  {
    allowedRoles: ['admin'],
    inputSchema: meetingPointSchema,
  },
  async (
    pointData: CreateMeetingPointInput
  ): Promise<{ data?: { meetingPointId: string }; error?: string }> => {
    try {
      const { latitude, longitude } = await getCoordsFromUrl(pointData.googleMapsUrl);

      const meetingPointRepository = new FirestoreMeetingPointRepository();
      const newMeetingPoint: MeetingPoint = {
        id: crypto.randomUUID(),
        ...pointData,
        latitude,
        longitude,
      };

      await createMeetingPointUseCase(meetingPointRepository, newMeetingPoint);

      return { data: { meetingPointId: newMeetingPoint.id } };
    } catch (error: any) {
      return { error: error.message || 'Failed to create meeting point.' };
    }
  }
);

    