import { getFirestore } from 'firebase-admin/firestore';
import { Invoice } from '../domain/invoice.model';
import { InvoiceRepository } from '../domain/invoice.repository';

export class FirestoreInvoiceRepository implements InvoiceRepository {
  private db = getFirestore();
  private collection = this.db.collection('invoices');

  async findById(id: string): Promise<Invoice | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as Invoice;
  }

  async findByBookingId(bookingId: string): Promise<Invoice | null> {
    const snapshot = await this.collection.where('bookingId', '==', bookingId).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].data() as Invoice;
  }
  
  async save(invoice: Invoice): Promise<void> {
    await this.collection.doc(invoice.id).set(invoice);
  }
}
