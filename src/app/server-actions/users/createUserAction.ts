
'use server';

import { createSafeAction } from '@/app/server-actions/lib/safe-action';
import { z } from 'zod';
import { createUser } from '@/backend/users/application/createUser';
import { FirestoreUserRepository } from '@/backend/users/infrastructure/firestore-user.repository';

const createUserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  name: z.string(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

// This is a public action, but it should only be called securely from the server-side
// after a user has been created in Firebase Auth.
export const createUserAction = createSafeAction(
  {},
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

      await createUser(userRepository, userData);

      return { data: { success: true } };

    } catch (error: any) {
      console.error('Error creating user document and claims:', error);
      return { error: 'Failed to finalize user creation.' };
    }
  }
);
