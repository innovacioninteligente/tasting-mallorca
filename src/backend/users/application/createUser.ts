
import { User, UserRole } from '../domain/user.model';
import { UserRepository } from '../domain/user.repository';
import { getAuth } from 'firebase-admin/auth';

const adminEmails = [
  'tastingmallorca2025@gmail.com',
  'caangogi@gmail.com'
];

export async function createUser(
  userRepository: UserRepository,
  user: Omit<User, 'id' | 'role'> & { id: string },
  roleOverride?: UserRole
): Promise<void> {

  // Determine the role: use override if provided, otherwise check admin list, else default to customer.
  const role: UserRole = roleOverride 
    ? roleOverride
    : adminEmails.includes(user.email.toLowerCase())
      ? 'admin'
      : 'customer';

  const newUser: User = {
    ...user,
    role: role, 
  };
  
  // Set custom claim for the new user
  await getAuth().setCustomUserClaims(newUser.id, { role: role });

  // Save the user document to Firestore
  await userRepository.save(newUser);
}
