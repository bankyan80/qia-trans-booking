import admin from 'firebase-admin'

function getServiceAccount(): Record<string, unknown> {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64
  if (b64) return JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))

  try {
    const fs = require('fs') as typeof import('fs')
    const path = require('path') as typeof import('path')
    const filePath = path.join(process.cwd(), 'firebase', 'service-account.json')
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    throw new Error('Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT_B64 env var or place firebase/service-account.json')
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
