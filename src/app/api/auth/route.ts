import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hashPassword, verifyPassword, createSessionToken } from '@/lib/auth';
import { verifyGoogleToken } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, provider, google_token } = body;

    // Google Login - verify with Firebase Admin
    if (provider === 'google') {
      if (!google_token) {
        return NextResponse.json({ error: 'Token Google diperlukan' }, { status: 400 });
      }

      const decoded = await verifyGoogleToken(google_token);
      if (!decoded || !decoded.email) {
        return NextResponse.json({ error: 'Token Google tidak valid' }, { status: 401 });
      }

      let user = await db.user.findUnique({ where: { email: decoded.email } });

      if (!user) {
        const hashedPassword = await hashPassword('google_oauth_' + decoded.uid);
        user = await db.user.create({
          data: {
            nama: decoded.name,
            email: decoded.email,
            no_wa: '',
            password: hashedPassword,
            role: 'customer',
          },
        });
      }

      const sessionToken = createSessionToken(user.id);
      const response = NextResponse.json({
        message: 'Login Google berhasil',
        user: { id: user.id, nama: user.nama, email: user.email, no_wa: user.no_wa, role: user.role },
        token: sessionToken,
      });
      response.cookies.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    // Email/Password Login
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password harus diisi' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Email tidak terdaftar' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    const sessionToken = createSessionToken(user.id);
    const response = NextResponse.json({
      message: 'Login berhasil',
      user: { id: user.id, nama: user.nama, email: user.email, no_wa: user.no_wa, role: user.role },
      token: sessionToken,
    });
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: 'Logout berhasil' });
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
