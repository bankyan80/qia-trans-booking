import admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'

const serviceAccountPath = path.join(process.cwd(), 'firebase', 'service-account.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

function getFirebaseApp() {
  if (admin.apps.length > 0) {
    return admin.app()
  }
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
