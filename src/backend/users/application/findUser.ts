import { User } from '../domain/user.model';
import { UserRepository } from '../domain/user.repository';

export async function findUserById(
  userRepository: UserRepository,
  id: string
): Promise<User | null> {
  return userRepository.findById(id);
}

export async function findUserByEmail(
  userRepository: UserRepository,
  email: string
): Promise<User | null> {
  return userRepository.findByEmail(email);
}
