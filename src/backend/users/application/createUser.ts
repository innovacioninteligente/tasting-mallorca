import { User } from '../domain/user.model';
import { UserRepository } from '../domain/user.repository';

// Note: In a real implementation, you would inject the repository
// dependency instead of passing it as an argument.
export async function createUser(
  userRepository: UserRepository,
  user: Omit<User, 'id' | 'role'> & { id: string }
): Promise<void> {
  const newUser: User = {
    ...user,
    role: 'customer', // Default role
  };
  await userRepository.save(newUser);
}
