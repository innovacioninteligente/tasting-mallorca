'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '../provider';
import type { DocumentData } from 'firebase/firestore';
import { useDoc } from '../firestore/use-doc';

export interface UserState extends User {
  customClaims: { [key: string]: any };
  profile: DocumentData | null;
  loading: boolean;
}

const createSessionCookie = async (idToken: string) => {
    try {
        await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
    } catch (error) {
        console.error('Failed to create session cookie:', error);
    }
};

const clearSessionCookie = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
        console.error('Failed to clear session cookie:', error);
    }
}

export const useUser = (): { user: UserState | null; loading: boolean } => {
  const auth = useAuth();
  const [user, setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: profile, loading: profileLoading } = useDoc(
    user ? `users/${user.uid}` : null
  );

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onIdTokenChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult();
        const customClaims = tokenResult.claims;
        const idToken = await firebaseUser.getIdToken();

        setUser({
          ...firebaseUser,
          customClaims,
          profile: null, // will be set by useDoc
          loading: true,
        });

        // Set session cookie when token changes
        await createSessionCookie(idToken);

      } else {
        setUser(null);
        // Clear session cookie on sign out
        await clearSessionCookie();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user && profile !== undefined) {
      setUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              profile: profile,
              loading: profileLoading,
            }
          : null
      );
    }
  }, [profile, profileLoading, user?.uid]);

  const isLoading = loading || (user != null && user.loading);

  return { user: user ? { ...user, loading: isLoading } : null, loading: isLoading };
};
