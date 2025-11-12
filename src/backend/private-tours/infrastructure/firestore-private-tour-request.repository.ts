import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { PrivateTourRequest } from '../domain/private-tour-request.model';
import { PrivateTourRequestRepository } from '../domain/private-tour-request.repository';

export class FirestorePrivateTourRequestRepository implements PrivateTourRequestRepository {
  private db = getFirestore();
  private collection = this.db.collection('privateTourRequests');

  private toDomain(doc: FirebaseFirestore.DocumentSnapshot): PrivateTourRequest {
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      submittedAt: (data.submittedAt as Timestamp).toDate(),
    } as PrivateTourRequest;
  }

  async findById(id: string): Promise<PrivateTourRequest | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.toDomain(doc);
  }

  async findAll(): Promise<PrivateTourRequest[]> {
    const snapshot = await this.collection.orderBy('submittedAt', 'desc').get();
    return snapshot.docs.map(doc => this.toDomain(doc));
  }

  async save(request: PrivateTourRequest): Promise<void> {
    await this.collection.doc(request.id).set(request);
  }
}
