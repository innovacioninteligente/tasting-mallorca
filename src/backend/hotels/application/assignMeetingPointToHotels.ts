
import { HotelRepository } from '../domain/hotel.repository';
import { MeetingPointRepository } from '@/backend/meeting-points/domain/meeting-point.repository';

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
        const hotels = await hotelRepository.findAll();
        const meetingPoints = await meetingPointRepository.findAll();

        if (hotels.length === 0 || meetingPoints.length === 0) {
            return { success: false, updatedCount: 0, error: "No hotels or meeting points found to process." };
        }

        let updatedCount = 0;

        for (const hotel of hotels) {
            let closestMeetingPoint = null;
            let minDistance = Infinity;

            for (const point of meetingPoints) {
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
