
import { getFirestore } from 'firebase-admin/firestore';
import { MeetingPoint } from '../domain/meeting-point.model';
import { MeetingPointRepository } from '../domain/meeting-point.repository';

export class FirestoreMeetingPointRepository implements MeetingPointRepository {
  private db = getFirestore();
  private collection = this.db.collection('meetingPoints');

  async findById(id: string): Promise<MeetingPoint | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as MeetingPoint;
  }

  async findAll(): Promise<MeetingPoint[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MeetingPoint));
  }

  async save(meetingPoint: MeetingPoint): Promise<void> {
    await this.collection.doc(meetingPoint.id).set(meetingPoint);
  }

  async update(meetingPoint: Partial<MeetingPoint> & { id: string }): Promise<void> {
    const { id, ...meetingPointData } = meetingPoint;
    await this.collection.doc(id).update(meetingPointData);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}

    