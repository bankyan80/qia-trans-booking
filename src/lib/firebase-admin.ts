import { OAuth2Client } from 'google-auth-library'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''
const client = new OAuth2Client(clientId)

export async function verifyGoogleToken(idToken: string) {
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: clientId })
    const payload = ticket.getPayload()
    if (!payload) return null
    return {
      uid: payload.sub,
      email: payload.email || '',
      name: payload.name || payload.email?.split('@')[0] || 'User',
      picture: payload.picture || '',
    }
  } catch (error) {
    console.error('Google token verification failed:', error)
    return null
  }
}
