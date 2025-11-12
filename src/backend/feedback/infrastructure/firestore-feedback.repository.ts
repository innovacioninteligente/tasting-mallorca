

import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { GuestFeedback } from '../domain/feedback.model';
import { FeedbackRepository } from '../domain/feedback.repository';

export class FirestoreFeedbackRepository implements FeedbackRepository {
  private db = getFirestore();
  private collection = this.db.collection('guestFeedback');

  private toDomain(doc: FirebaseFirestore.DocumentSnapshot): GuestFeedback {
    const data = doc.data()!;
    return {
      ...data,
      id: doc.id,
      submittedAt: (data.submittedAt as Timestamp).toDate(),
    } as GuestFeedback;
  }

  async findById(id: string): Promise<GuestFeedback | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.toDomain(doc);
  }

  async findAll(): Promise<GuestFeedback[]> {
    const snapshot = await this.collection.orderBy('submittedAt', 'desc').get();
    return snapshot.docs.map(doc => this.toDomain(doc));
  }

  async save(feedback: GuestFeedback): Promise<void> {
    await this.collection.doc(feedback.id).set(feedback);
  }

  async update(feedback: Partial<GuestFeedback> & { id: string }): Promise<void> {
    const { id, ...feedbackData } = feedback;
    await this.collection.doc(id).update(feedbackData);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
