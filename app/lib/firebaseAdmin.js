import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const appName = 'room2room-admin';
const adminApp =
  getApps().find((app) => app.name === appName) ||
  initializeApp(
    {
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    appName
  );

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
