import admin from 'firebase-admin'

function getServiceAccount(): Record<string, unknown> {
  const envSa = process.env.FIREBASE_SERVICE_ACCOUNT
  if (envSa) return JSON.parse(envSa)

  try {
    const fs = require('fs') as typeof import('fs')
    const path = require('path') as typeof import('path')
    const filePath = path.join(process.cwd(), 'firebase', 'service-account.json')
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    throw new Error('Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT env var or place firebase/service-account.json')
  }
}

function getFirebaseApp() {
  if (admin.apps.length > 0) return admin.app()
  const sa = getServiceAccount()
  return admin.initializeApp({ credential: admin.credential.cert(sa) })
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
