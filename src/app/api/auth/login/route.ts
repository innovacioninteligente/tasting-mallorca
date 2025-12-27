
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/firebase/server/config';

// Initialize Firebase Admin SDK
adminApp;

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
      const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
      (await cookies()).set('session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });

      return NextResponse.json({ status: 'success' });
    } catch (error) {
      console.error('Error creating session cookie:', error);
      return NextResponse.json({ status: 'error', message: 'Failed to create session' }, { status: 401 });
    }
  }

  return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
}
