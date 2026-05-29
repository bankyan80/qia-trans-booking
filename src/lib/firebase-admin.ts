import admin from 'firebase-admin'

function getFirebaseApp() {
  if (admin.apps.length > 0) {
    return admin.app()
  }

  const envSa = process.env.FIREBASE_SERVICE_ACCOUNT
  if (envSa) {
    try {
      const sa = JSON.parse(envSa)
      return admin.initializeApp({ credential: admin.credential.cert(sa) })
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', e)
      throw e
    }
  }

  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'firebase', 'service-account.json')
    const sa = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return admin.initializeApp({ credential: admin.credential.cert(sa) })
  } catch (e) {
    console.error('Failed to load firebase service account from file:', e)
    throw e
  }
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
