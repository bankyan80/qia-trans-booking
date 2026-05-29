import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const count = await db.user.count()
    return NextResponse.json({ success: true, userCount: count })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'unknown',
    })
  }
}
