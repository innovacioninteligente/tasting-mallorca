
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { createUser } from '@/backend/users/application/createUser';
import { FirestoreUserRepository } from '@/backend/users/infrastructure/firestore-user.repository';
import { UserRole } from '@/backend/users/domain/user.model';

const createUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['customer', 'guide', 'admin']).optional(), // Role is now optional
});

type CreateUserInput = z.infer<typeof createUserSchema>;

// This action is protected and can only be called by an admin or from a trusted server environment
export const createUserAction = createSafeAction(
  {
    allowedRoles: ['admin'], // Only admins can create users this way now
  },
  async (
    input: CreateUserInput,
    adminUser
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const userRepository = new FirestoreUserRepository();
      
      const userData = {
        id: input.uid,
        email: input.email,
        name: input.name,
      };

      // Pass the role override to the use case
      await createUser(userRepository, userData, input.role);

      return { data: { success: true } };

    } catch (error: any) {
      console.error('Error creating user document and claims:', error);
      return { error: 'Failed to finalize user creation.' };
    }
  }
);
