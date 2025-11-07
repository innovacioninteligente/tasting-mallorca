
// This is a higher-order function to create safe server actions.
// It should not contain 'use server'; itself. Instead, the files
// that use this function to define actions should have 'use server';

import { getAuth } from 'firebase-admin/auth';
import { headers } from 'next/headers';
import { adminApp } from '@/firebase/server/config';
import { findUserById } from '@/backend/users/application/findUser';
import { FirestoreUserRepository } from '@/backend/users/infrastructure/firestore-user.repository';
import { User, UserRole } from '@/backend/users/domain/user.model';

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

interface AuthOptions {
  allowedRoles?: UserRole[];
}

export function createSafeAction<TInput, TOutput>(
  authOptions: AuthOptions,
  action: Action<TInput, TOutput>
) {
  return async (
    input: TInput
  ): Promise<{ data?: TOutput; error?: string }> => {
    const idToken = headers().get('Authorization')?.split('Bearer ')[1];

    if (!idToken) {
      return { error: 'Unauthorized: No token provided.' };
    }

    try {
      const decodedToken = await getAuth().verifyIdToken(idToken);
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
      if (error.code === 'auth/id-token-expired') {
        return { error: 'Unauthorized: Token expired.' };
      }
      return { error: error.message || 'An unexpected server error occurred.' };
    }
  };
}
