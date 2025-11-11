
import { Hotel } from '../domain/hotel.model';
import { HotelRepository } from '../domain/hotel.repository';
import { MeetingPointRepository } from '@/backend/meeting-points/domain/meeting-point.repository';
import { MeetingPoint } from '@/backend/meeting-points/domain/meeting-point.model';

// Haversine formula to calculate distance between two lat/lon points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

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

            let closestMeetingPoint: MeetingPoint | null = null;
            let minDistance = Infinity;

            for (const point of meetingPoints) {
                 // Skip meeting points that don't have coordinates
                if (point.latitude === undefined || point.longitude === undefined) {
                    continue;
                }
                const distance = getDistance(hotel.latitude, hotel.longitude, point.latitude, point.longitude);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestMeetingPoint = point;
                }
            }

            if (closestMeetingPoint && hotel.assignedMeetingPointId !== closestMeetingPoint.id) {
                await hotelRepository.update({
                    id: hotel.id,
                    assignedMeetingPointId: closestMeetingPoint.id,
                });
                updatedCount++;
            }
        }
        
        return { success: true, updatedCount };

    } catch (error: any) {
        console.error("Error assigning meeting points to hotels:", error);
        return { success: false, updatedCount: 0, error: error.message };
    }
}
