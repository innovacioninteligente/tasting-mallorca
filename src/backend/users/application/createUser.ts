import { User, UserRole } from '../domain/user.model';
import { UserRepository } from '../domain/user.repository';
import { getAuth } from 'firebase-admin/auth';

export async function createUser(
  userRepository: UserRepository,
  user: Omit<User, 'id' | 'role'> & { id: string }
): Promise<void> {
  const newUser: User = {
    ...user,
    role: 'customer', // Default role
  };
  
  // Set custom claim for the new user
  await getAuth().setCustomUserClaims(newUser.id, { role: 'customer' });

  // Save the user document to Firestore
  await userRepository.save(newUser);
}
