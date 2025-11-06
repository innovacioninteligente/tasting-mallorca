import { getFirestore } from 'firebase-admin/firestore';
import { Payment, PaymentStatus } from '../domain/payment.model';
import { PaymentRepository } from '../domain/payment.repository';

export class FirestorePaymentRepository implements PaymentRepository {
  private db = getFirestore();
  private collection = this.db.collection('payments');

  async findById(id: string): Promise<Payment | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Payment;
  }

  async findByBookingId(bookingId: string): Promise<Payment | null> {
      const snapshot = await this.collection.where('bookingId', '==', bookingId).limit(1).get();
      if (snapshot.empty) {
          return null;
      }
      return snapshot.docs[0].data() as Payment;
  }

  async findByPaymentIntentId(paymentIntentId: string): Promise<Payment | null> {
    const snapshot = await this.collection.where('stripePaymentIntentId', '==', paymentIntentId).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].data() as Payment;
  }

  async save(payment: Payment): Promise<void> {
    await this.collection.doc(payment.id).set(payment);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    await this.collection.doc(id).update({ status });
  }
}
