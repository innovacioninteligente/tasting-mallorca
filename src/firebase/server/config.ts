
import { initializeApp, getApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';

const createFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }

  // Ensure all required environment variables are set
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin SDK credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.'
    );
  }

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    // Replace escaped newlines from the environment variable
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };

  try {
    const app = initializeApp({
      credential: cert(serviceAccount)
    });
    
    return app;

  } catch (error: any) {
    console.error('Firebase Admin SDK initialization failed:', error);
    throw new Error(`Failed to initialize Firebase Admin: ${error.message}`);
  }
};

export const adminApp = createFirebaseAdminApp();
