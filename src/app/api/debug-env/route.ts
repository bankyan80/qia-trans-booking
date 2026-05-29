import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    tursoUrl: process.env.TURSO_DATABASE_URL ? 'set' : 'not set',
    tursoToken: process.env.TURSO_AUTH_TOKEN ? 'set' : 'not set',
  })
}
