
import { getFirestore } from 'firebase-admin/firestore';
import { User } from '../domain/user.model';
import { UserRepository } from '../domain/user.repository';

export class FirestoreUserRepository implements UserRepository {
  private db = getFirestore();
  private collection = this.db.collection('users');

  async findById(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as User;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection.where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async findAll(): Promise<User[]> {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }

  async save(user: User): Promise<void> {
    await this.collection.doc(user.id).set(user);
  }

  async update(user: Partial<User> & { id: string }): Promise<void> {
    const { id, ...userData } = user;
    await this.collection.doc(id).update(userData);
  }
}
