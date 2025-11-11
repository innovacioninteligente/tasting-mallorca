import { MeetingPoint } from '../domain/meeting-point.model';
import { MeetingPointRepository } from '../domain/meeting-point.repository';

export async function updateMeetingPoint(
  meetingPointRepository: MeetingPointRepository,
  meetingPointData: Partial<MeetingPoint> & { id: string }
): Promise<void> {
  await meetingPointRepository.update(meetingPointData);
}
