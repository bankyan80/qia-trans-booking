import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminOnlyPaths = ['/api/cars/(.*)', '/api/settings', '/api/seed', '/api/handover', '/api/payments/[^/]+']
const authRequiredPaths = ['/api/bookings', '/api/payments', '/api/upload', '/api/handover']

function matchPath(pathname: string, patterns: string[]): boolean {
  try {
    return patterns.some(pattern => {
      const regex = new RegExp('^' + pattern + '$')
      return regex.test(pathname)
    })
  } catch { return false }
}

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const sessionCookie = request.cookies.get('session')?.value
    const authHeader = request.headers.get('authorization')

    if (!sessionCookie && !authHeader) {
      if (matchPath(pathname, adminOnlyPaths)) {
        return NextResponse.json({ error: 'Akses ditolak. Silakan login sebagai admin' }, { status: 401 })
      }
      if (matchPath(pathname, authRequiredPaths)) {
        if (request.method === 'GET' && pathname === '/api/bookings') return NextResponse.next()
        if (request.method === 'GET' && pathname === '/api/payments') return NextResponse.next()
        if (request.method === 'POST' && pathname === '/api/bookings') {
          return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 })
        }
        if (pathname.startsWith('/api/payments') && request.method === 'POST') {
          return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 })
        }
        if (pathname.startsWith('/api/handover')) {
          return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 })
        }
      }
    }

    if (pathname.startsWith('/api/seed')) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    return NextResponse.next()
  } catch (e) {
    console.error('Middleware error:', e)
    return NextResponse.json({ error: 'Middleware error' }, { status: 500 })
  }
}

export const config = {
  matcher: ['/api/:path*'],
}
