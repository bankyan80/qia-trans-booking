import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const SALT_ROUNDS = 12
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-change-me'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createSessionToken(userId: string): string {
  const payload = `${userId}:${Date.now()}`
  const encoded = Buffer.from(payload).toString('base64')
  return encoded
}

export function decodeSessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [userId] = decoded.split(':')
    return userId || null
  } catch {
    return null
  }
}

export interface AuthUser {
  id: string
  nama: string
  email: string
  role: string
  no_wa: string
}

export async function getUserFromToken(token: string | null): Promise<AuthUser | null> {
  if (!token) return null
  const userId = decodeSessionToken(token)
  if (!userId) return null
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, nama: true, email: true, role: true, no_wa: true },
  })
  return user
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  const token = getTokenFromRequest(request)
  const user = await getUserFromToken(token)
  if (!user) {
    throw new AuthError('Silakan login terlebih dahulu', 401)
  }
  return user
}

export async function requireAdmin(request: Request): Promise<AuthUser> {
  const user = await requireAuth(request)
  if (user.role !== 'admin') {
    throw new AuthError('Akses ditolak. Hanya admin yang dapat mengakses ini', 403)
  }
  return user
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number = 401) {
    super(message)
    this.status = status
  }
}

export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  console.error('Auth error:', error)
  return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
}
