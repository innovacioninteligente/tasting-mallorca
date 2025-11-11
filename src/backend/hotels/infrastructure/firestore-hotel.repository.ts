
import { getFirestore } from 'firebase-admin/firestore';
import { Hotel } from '../domain/hotel.model';
import { HotelRepository } from '../domain/hotel.repository';

export class FirestoreHotelRepository implements HotelRepository {
  private db = getFirestore();
  private collection = this.db.collection('hotels');

  async findById(id: string): Promise<Hotel | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as Hotel;
  }

  async findAll(): Promise<Hotel[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hotel));
  }

  async save(hotel: Hotel): Promise<void> {
    await this.collection.doc(hotel.id).set(hotel);
  }

  async update(hotel: Partial<Hotel> & { id: string }): Promise<void> {
    const { id, ...hotelData } = hotel;
    await this.collection.doc(id).update(hotelData);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}

    