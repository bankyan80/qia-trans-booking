import admin from 'firebase-admin'

function getServiceAccount() {
  const envSa = process.env.FIREBASE_SERVICE_ACCOUNT
  if (envSa) {
    return JSON.parse(envSa)
  }
  // fallback for local dev
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  const filePath = path.join(process.cwd(), 'firebase', 'service-account.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function getFirebaseApp() {
  if (admin.apps.length > 0) {
    return admin.app()
  }
  return admin.initializeApp({
    credential: admin.credential.cert(getServiceAccount()),
  })
}

export async function verifyGoogleToken(idToken: string) {
  const app = getFirebaseApp()
  try {
    const decoded = await app.auth().verifyIdToken(idToken)
    return {
      uid: decoded.uid,
      email: decoded.email || '',
      name: decoded.name || decoded.email?.split('@')[0] || 'User',
      picture: decoded.picture || '',
    }
  } catch (error) {
    console.error('Firebase token verification failed:', error)
    return null
  }
}
