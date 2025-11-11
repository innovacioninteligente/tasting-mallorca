import { MeetingPoint } from '../domain/meeting-point.model';
import { MeetingPointRepository } from '../domain/meeting-point.repository';

export async function findMeetingPointById(
  meetingPointRepository: MeetingPointRepository,
  id: string
): Promise<MeetingPoint | null> {
  return meetingPointRepository.findById(id);
}

export async function findAllMeetingPoints(
  meetingPointRepository: MeetingPointRepository
): Promise<MeetingPoint[]> {
  return meetingPointRepository.findAll();
}
