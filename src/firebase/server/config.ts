import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';

// This is a special case for the dev environment
// In a deployed environment, you would use environment variables
// that are properly formatted.
let serviceAccount: any;
try {
  serviceAccount = require('../../../service-account.json');
} catch (e) {
  // We ignore this error, as it will only happen in a deployed environment
}

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
    const parsedServiceAccount = JSON.parse(serviceAccountString);

    return initializeApp({
      credential: cert(parsedServiceAccount)
    });
  } catch (error) {
    console.error('Failed to parse Firebase service account JSON.', error);
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not a valid JSON string.');
  }
};

export const adminApp = createFirebaseAdminApp();
