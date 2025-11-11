
import { MeetingPointRepository } from '../domain/meeting-point.repository';
import { getCoordsFromUrl } from '@/app/server-actions/meeting-points/utils/getCoordsFromUrl';

export async function reprocessCoordinatesForMissingPoints(
    meetingPointRepository: MeetingPointRepository
): Promise<{ success: boolean, updatedCount: number, error?: string }> {
    try {
        const allPoints = await meetingPointRepository.findAll();
        
        const pointsToUpdate = allPoints.filter(point => !point.latitude || !point.longitude);

        if (pointsToUpdate.length === 0) {
            return { success: true, updatedCount: 0 };
        }

        let updatedCount = 0;

        for (const point of pointsToUpdate) {
            try {
                const { latitude, longitude } = await getCoordsFromUrl(point.googleMapsUrl);
                
                if (latitude && longitude) {
                    await meetingPointRepository.update({
                        id: point.id,
                        latitude,
                        longitude,
                    });
                    updatedCount++;
                }
            } catch (error: any) {
                console.warn(`Could not update coordinates for point ${point.id} (${point.name}): ${error.message}`);
                // Continue to the next point even if one fails
            }
        }
        
        return { success: true, updatedCount };

    } catch (error: any) {
        console.error("Error reprocessing coordinates:", error);
        return { success: false, updatedCount: 0, error: error.message };
    }
}
