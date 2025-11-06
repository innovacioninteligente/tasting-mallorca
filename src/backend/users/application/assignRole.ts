import { getAuth } from 'firebase-admin/auth';
import { UserRepository } from '../domain/user.repository';
import { UserRole } from '../domain/user.model';
import { FirestoreUserRepository } from '../infrastructure/firestore-user.repository';

export async function assignRole(
  email: string,
  role: UserRole
): Promise<void> {

  const userRepository = new FirestoreUserRepository();
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error(`User with email ${email} not found.`);
  }

  // Set custom claims on Firebase Auth
  await getAuth().setCustomUserClaims(user.id, { role });

  // Update role in Firestore document for consistency
  await userRepository.update({ id: user.id, role });
}
