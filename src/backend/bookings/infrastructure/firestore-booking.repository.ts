import { getFirestore } from 'firebase-admin/firestore';
import { Booking, BookingStatus } from '../domain/booking.model';
import { BookingRepository } from '../domain/booking.repository';

export class FirestoreBookingRepository implements BookingRepository {
  private db = getFirestore();
  private collection = this.db.collection('bookings');

  async findById(id: string): Promise<Booking | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Booking;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => doc.data() as Booking);
  }

  async save(booking: Booking): Promise<Booking> {
    await this.collection.doc(booking.id).set(booking);
    return booking;
  }

  async updateStatus(id: string, status: BookingStatus): Promise<void> {
    await this.collection.doc(id).update({ status });
  }

  async update(id: string, data: Partial<Booking>): Promise<void> {
    await this.collection.doc(id).update(data);
  }
}
