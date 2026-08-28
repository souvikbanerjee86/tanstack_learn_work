import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (!getApps().length) {
  // const serviceAccountString = process.env.APP_FIREBASE_SERVICE_ACCOUNT_JSON

  // if (!serviceAccountString) {
  //   throw new Error(
  //     'The APP_FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.',
  //   )
  // }
  // try {
  //   const serviceAccount = JSON.parse(serviceAccountString)
  //   initializeApp({
  //     credential: cert(serviceAccount),
  //   })
  // } catch (error) {
  //   console.error(
  //     'Failed to initialize Firebase Admin SDK: Invalid Service Account Configuration',
  //   )
  //   throw new Error('Firebase Admin SDK initialization failed.')
  // }
  initializeApp()
}

export const adminAuth = getAuth()
