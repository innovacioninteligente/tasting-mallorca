
'use server';

import { createSafeAction } from '../lib/safe-action';
import { assignRole as assignRoleUseCase } from '@/backend/users/application/assignRole';
import { UserRole } from '@/backend/users/domain/user.model';
import { findUserByEmail } from '@/backend/users/application/findUser';
import { FirestoreUserRepository } from '@/backend/users/infrastructure/firestore-user.repository';

interface AssignRoleInput {
  email: string;
  role: UserRole;
}

export const assignRole = createSafeAction(
  {
    allowedRoles: ['admin'],
  },
  async (
    input: AssignRoleInput
  ): Promise<{ data?: { success: true }; error?: string }> => {
    const { email, role } = input;

    if (!email || !role) {
      return { error: 'Email and role are required.' };
    }

    if (!['admin', 'guide', 'customer'].includes(role)) {
      return { error: 'Invalid role specified.' };
    }

    try {
        const userRepository = new FirestoreUserRepository();
        const userToUpdate = await findUserByEmail(userRepository, email);

        if (!userToUpdate) {
            return { error: `User with email ${email} not found.` };
        }

        await assignRoleUseCase(userToUpdate.id, role);
        return { data: { success: true } };

    } catch (error: any) {
      return { error: error.message || 'Failed to assign role.' };
    }
  }
);
