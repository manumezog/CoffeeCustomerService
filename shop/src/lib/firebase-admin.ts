import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0]!

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!serviceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT env var is not set')
  }

  return initializeApp({
    credential: cert(JSON.parse(serviceAccount)),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  })
}

let _db: Firestore | null = null

export function getAdminDb(): Firestore {
  if (!_db) {
    _db = getFirestore(
      getAdminApp(),
      process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID || 'coffee-cs-db',
    )
  }
  return _db
}
