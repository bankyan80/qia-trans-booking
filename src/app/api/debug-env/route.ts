import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL || ''
  return NextResponse.json({
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    tursoUrl: url ? `${url.slice(0, 10)}...${url.slice(-5)} (len: ${url.length})` : 'not set',
    tursoToken: process.env.TURSO_AUTH_TOKEN ? 'set' : 'not set',
  })
}
