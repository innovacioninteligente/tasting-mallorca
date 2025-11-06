import { getAuth } from 'firebase-admin/auth';
import { UserRepository } from '../domain/user.repository';
import { UserRole } from '../domain/user.model';
import { FirestoreUserRepository } from '../infrastructure/firestore-user.repository';

export async function assignRole(
  uid: string,
  role: UserRole
): Promise<void> {

  const userRepository = new FirestoreUserRepository();
  const user = await userRepository.findById(uid);

  if (!user) {
    throw new Error(`User with uid ${uid} not found in Firestore.`);
  }

  // Set custom claims on Firebase Auth
  await getAuth().setCustomUserClaims(uid, { role });

  // Update role in Firestore document for consistency
  await userRepository.update({ id: uid, role });
}
