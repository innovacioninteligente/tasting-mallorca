
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { findAllUsers } from '@/backend/users/application/findAllUsers';
import { FirestoreUserRepository } from '@/backend/users/infrastructure/firestore-user.repository';
import { User } from '@/backend/users/domain/user.model';

export const getUsers = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (_: {}): Promise<{ data?: User[]; error?: string }> => {
    try {
      const userRepository = new FirestoreUserRepository();
      const users = await findAllUsers(userRepository);
      // The users object is converted to a plain object to avoid Next.js serialization issues.
      return { data: JSON.parse(JSON.stringify(users)) };
    } catch (error: any) {
      return { error: error.message || 'Failed to fetch users.' };
    }
  }
);
