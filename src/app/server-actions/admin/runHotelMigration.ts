'use server';

import { createSafeAction } from "@/app/server-actions/lib/safe-action";
import { assignMeetingPointToHotels } from '@/backend/hotels/application/assignMeetingPointToHotels';
import { FirestoreHotelRepository } from '@/backend/hotels/infrastructure/firestore-hotel.repository';
import { FirestoreMeetingPointRepository } from '@/backend/meeting-points/infrastructure/firestore-meeting-point.repository';
import { z } from 'zod';

const MigrationSchema = z.object({});

export const runHotelMigration = createSafeAction(
    {
        inputSchema: MigrationSchema,
        allowedRoles: ['admin']
    },
    async (_data, _user) => {
        // Double check admin role if needed (createSafeAction handles basic role check)
        const hotelRepo = new FirestoreHotelRepository();
        const mpRepo = new FirestoreMeetingPointRepository();

        const result = await assignMeetingPointToHotels(hotelRepo, mpRepo);

        if (!result.success) {
            throw new Error(result.error || "Migration failed.");
        }

        return { data: { success: true, updatedCount: result.updatedCount } };
    }
);
