import { getFirestore } from 'firebase-admin/firestore';
import { Tour } from '../domain/tour.model';
import { TourRepository } from '../domain/tour.repository';

export class FirestoreTourRepository implements TourRepository {
  private db = getFirestore();
  private collection = this.db.collection('tours');

  async findById(id: string): Promise<Tour | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Tour;
  }

  async findBySlug(slug: string, lang: string): Promise<Tour | null> {
    const snapshot = await this.collection.where(`slug.${lang}`, '==', slug).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].data() as Tour;
  }

  async findAll(): Promise<Tour[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => doc.data() as Tour);
  }

  async save(tour: Tour): Promise<void> {
    await this.collection.doc(tour.id).set(tour);
  }

  async update(tour: Partial<Tour> & { id: string }): Promise<void> {
    const { id, ...tourData } = tour;
    await this.collection.doc(id).update(tourData);
  }
}
