import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App | undefined;
let auth: Auth | undefined;

function getFirebaseAdminApp(): App {
  if (!app) {
    const apps = getApps();
    if (apps.length > 0) {
      app = apps[0];
    } else {
      // Initialize with service account or application default credentials
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      if (serviceAccount) {
        try {
          const parsedServiceAccount = JSON.parse(serviceAccount);
          app = initializeApp({
            credential: cert(parsedServiceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        } catch {
          // If parsing fails, try using ADC
          app = initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          });
        }
      } else {
        // Use application default credentials (for production environments)
        app = initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      }
    }
  }
  return app;
}

export function getFirebaseAdminAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseAdminApp());
  }
  return auth;
}

export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}

export async function getUserFromToken(token: string) {
  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) return null;

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
  };
}
