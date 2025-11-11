
import { MeetingPoint } from './meeting-point.model';

export interface MeetingPointRepository {
  findById(id: string): Promise<MeetingPoint | null>;
  findAll(): Promise<MeetingPoint[]>;
  save(meetingPoint: MeetingPoint): Promise<void>;
  update(meetingPoint: Partial<MeetingPoint> & { id: string }): Promise<void>;
  delete(id: string): Promise<void>;
}

    