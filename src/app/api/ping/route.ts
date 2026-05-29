import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ ok: true, provider: body.provider })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'unknown'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
