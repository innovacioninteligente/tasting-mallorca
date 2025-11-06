import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';

const createFirebaseAdminApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }

  // When running locally, the GOOGLE_APPLICATION_CREDENTIALS env var will point
  // to a local file. On App Hosting, it will be populated automatically.
  const credential = cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string);

  return initializeApp({
    credential
  });
};

export const adminApp = createFirebaseAdminApp();
