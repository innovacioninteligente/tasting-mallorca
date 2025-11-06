import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';

const createFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }

  // Parse the service account key from the environment variable.
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountString) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.');
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);

    return initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (error) {
    console.error('Failed to parse Firebase service account JSON.', error);
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not a valid JSON string.');
  }
};

export const adminApp = createFirebaseAdminApp();
