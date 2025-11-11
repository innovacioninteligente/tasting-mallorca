import { MeetingPoint } from '../domain/meeting-point.model';
import { MeetingPointRepository } from '../domain/meeting-point.repository';

export async function createMeetingPoint(
  meetingPointRepository: MeetingPointRepository,
  meetingPointData: MeetingPoint
): Promise<string> {
  await meetingPointRepository.save(meetingPointData);
  return meetingPointData.id;
}
