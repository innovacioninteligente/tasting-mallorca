import { Hotel } from '../domain/hotel.model';
import { HotelRepository } from '../domain/hotel.repository';
import { MeetingPointRepository } from '@/backend/meeting-points/domain/meeting-point.repository';
import { MeetingPoint } from '@/backend/meeting-points/domain/meeting-point.model';
import { getDistance } from '@/lib/geo-utils';

const REGIONS = ['North', 'East', 'South', 'West', 'Central'];

export async function assignMeetingPointToHotels(
    hotelRepository: HotelRepository,
    meetingPointRepository: MeetingPointRepository
): Promise<{ success: boolean, updatedCount: number, error?: string }> {
    try {
        const hotels: Hotel[] = await hotelRepository.findAll();
        const meetingPoints: MeetingPoint[] = await meetingPointRepository.findAll();

        if (hotels.length === 0 || meetingPoints.length === 0) {
            return { success: false, updatedCount: 0, error: "No hotels or meeting points found to process." };
        }

        let updatedCount = 0;

        for (const hotel of hotels) {
            // Skip hotels that don't have coordinates
            if (hotel.latitude === undefined || hotel.longitude === undefined) {
                console.warn(`Skipping hotel ${hotel.id} (${hotel.name}) due to missing coordinates.`);
                continue;
            }

            const newAssignments: { [key: string]: string } = {};
            let globalClosestPointId: string | null = null;
            let globalMinDistance = Infinity;

            // 1. Calculate best Meeting Point for EACH Region
            for (const region of REGIONS) {
                const regionPoints = meetingPoints.filter(mp => mp.region === region && mp.latitude !== undefined && mp.longitude !== undefined);

                let regionClosestPoint: MeetingPoint | null = null;
                let regionMinDistance = Infinity;

                for (const point of regionPoints) {
                    const distance = getDistance(hotel.latitude, hotel.longitude, point.latitude!, point.longitude!);

                    if (distance < regionMinDistance) {
                        regionMinDistance = distance;
                        regionClosestPoint = point;
                    }
                }

                if (regionClosestPoint) {
                    newAssignments[region] = regionClosestPoint.id;
                }
            }

            // 2. Calculate the global closest point (for backward compatibility)
            // We can reuse the logic or just loop all valid points
            for (const point of meetingPoints) {
                if (point.latitude === undefined || point.longitude === undefined) continue;
                const distance = getDistance(hotel.latitude, hotel.longitude, point.latitude, point.longitude);
                if (distance < globalMinDistance) {
                    globalMinDistance = distance;
                    globalClosestPointId = point.id;
                }
            }

            // 3. Update the Hotel
            // We update if the assignments map is different or if it's a new field
            // Ideally should check for deep equality, but here we just overwrite to be safe and ensure migration
            await hotelRepository.update({
                id: hotel.id,
                assignedMeetingPoints: newAssignments,
                assignedMeetingPointId: globalClosestPointId // Maintain for legacy
            });
            updatedCount++;
        }

        return { success: true, updatedCount };

    } catch (error: any) {
        console.error("Error assigning meeting points to hotels:", error);
        return { success: false, updatedCount: 0, error: error.message };
    }
}
