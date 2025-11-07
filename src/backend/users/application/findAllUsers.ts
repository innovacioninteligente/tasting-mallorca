
import { User } from '../domain/user.model';
import { UserRepository } from '../domain/user.repository';

export async function findAllUsers(
  userRepository: UserRepository
): Promise<User[]> {
  return userRepository.findAll();
}
