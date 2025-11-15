
import { initializeApp, getApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';

const createFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }
  
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!storageBucket) {
      throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set.');
  }

  // Vercel/Production environment: Use Base64 encoded service account
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    try {
      const decodedServiceAccount = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
      const serviceAccountJson = JSON.parse(decodedServiceAccount);
      
      return initializeApp({
        credential: cert(serviceAccountJson),
        storageBucket: storageBucket,
      });
    } catch (error: any) {
        console.error('Error parsing Base64 Firebase credentials:', error);
        throw new Error(`Failed to initialize Firebase Admin from Base64: ${error.message}`);
    }
  }

  // Local development environment: Use individual environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin SDK credentials. For production, set FIREBASE_SERVICE_ACCOUNT_BASE64. For local dev, set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };

  try {
    return initializeApp({
      credential: cert(serviceAccount),
      storageBucket: storageBucket,
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization failed:', error);
    throw new Error(`Failed to initialize Firebase Admin: ${error.message}`);
  }
};

export const adminApp = createFirebaseAdminApp();
