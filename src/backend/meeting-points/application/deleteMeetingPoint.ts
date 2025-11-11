import { MeetingPointRepository } from '../domain/meeting-point.repository';

export async function deleteMeetingPoint(
  meetingPointRepository: MeetingPointRepository,
  id: string
): Promise<void> {
  await meetingPointRepository.delete(id);
}
