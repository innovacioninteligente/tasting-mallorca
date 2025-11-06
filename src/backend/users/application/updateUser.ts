import { User } from '../domain/user.model';
import { UserRepository } from '../domain/user.repository';

export async function updateUser(
  userRepository: UserRepository,
  user: Partial<User> & { id: string }
): Promise<void> {
  await userRepository.update(user);
}
