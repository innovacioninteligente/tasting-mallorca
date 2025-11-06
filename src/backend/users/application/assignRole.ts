import { getAuth } from 'firebase-admin/auth';
import { UserRepository } from '../domain/user.repository';
import { UserRole } from '../domain/user.model';

export async function assignRole(
  userRepository: UserRepository,
  email: string,
  role: UserRole
): Promise<void> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error(`User with email ${email} not found.`);
  }

  // Set custom claims on Firebase Auth
  await getAuth().setCustomUserClaims(user.id, { role });

  // Update role in Firestore document for consistency
  await userRepository.update({ id: user.id, role });
}
