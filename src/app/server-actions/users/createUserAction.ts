
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

// This action is now public for user registration but secured for role assignment.
export const createUserAction = createSafeAction(
  {
    // No allowedRoles, making it a public action.
  },
  async (
    input: CreateUserInput
  ): Promise<{ data?: { success: true }; error?: string }> => {
    try {
      const userRepository = new FirestoreUserRepository();
      
      const userData = {
        id: input.uid,
        email: input.email,
        name: input.name,
      };

      // Pass the role override to the use case.
      // The createUser use case itself contains the logic to prevent non-admins from assigning roles.
      // A new user will get 'customer' by default unless their email is in the admin list.
      await createUser(userRepository, userData, input.role);

      return { data: { success: true } };

    } catch (error: any) {
      console.error('Error creating user document and claims:', error);
      return { error: 'Failed to finalize user creation.' };
    }
  }
);
