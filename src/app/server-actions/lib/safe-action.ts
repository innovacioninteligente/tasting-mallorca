
// This is a higher-order function to create safe server actions.
// It should not contain 'use server'; itself. Instead, the files
// that use this function to define actions should have 'use server';
// This comment is to clarify usage and prevent future errors.

import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { adminApp } from '@/firebase/server/config';
import { findUserById } from '@/backend/users/application/findUser';
import { FirestoreUserRepository } from '@/backend/users/infrastructure/firestore-user.repository';
import { User, UserRole } from '@/backend/users/domain/user.model';
import { ZodSchema } from 'zod';

// Initialize Firebase Admin SDK
adminApp;

type Action<TInput, TOutput> = (
  input: TInput,
  user: {
    uid: string;
    role: UserRole;
    user: User;
  }
) => Promise<{ data?: TOutput; error?: string }>;

interface AuthOptions<TInput> {
  allowedRoles?: UserRole[];
  inputSchema?: ZodSchema<TInput>;
}

export function createSafeAction<TInput, TOutput>(
  authOptions: AuthOptions<TInput>,
  action: Action<TInput, TOutput>
) {
  return async (
    input: TInput
  ): Promise<{ data?: TOutput; error?: string }> => {
    
    // Validate input with Zod schema if provided
    if (authOptions.inputSchema) {
        const validationResult = authOptions.inputSchema.safeParse(input);
        if (!validationResult.success) {
            return { error: 'Invalid input: ' + validationResult.error.format()._errors.join(', ') };
        }
    }

    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
      return { error: 'Unauthorized: No session cookie provided.' };
    }

    try {
      const decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
      const uid = decodedToken.uid;
      const userRole = (decodedToken.role as UserRole) || 'customer';

      if (
        authOptions.allowedRoles &&
        authOptions.allowedRoles.length > 0 &&
        !authOptions.allowedRoles.includes(userRole)
      ) {
        return {
          error: `Forbidden: User with role '${userRole}' is not allowed to perform this action.`,
        };
      }

      const userRepository = new FirestoreUserRepository();
      const user = await findUserById(userRepository, uid);

      if (!user) {
        return { error: 'User not found in database.' };
      }

      return await action(input, { uid, role: userRole, user });
    } catch (error: any) {
      console.error('Error in safe action:', error);
      if (error.code === 'auth/session-cookie-expired') {
        return { error: 'Unauthorized: Session expired. Please sign in again.' };
      }
      if (error.code === 'auth/session-cookie-revoked') {
          return { error: 'Unauthorized: Session revoked. Please sign in again.' };
      }
      return { error: error.message || 'An unexpected server error occurred.' };
    }
  };
}
