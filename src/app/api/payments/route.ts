import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAuth, handleAuthError } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const booking_id = searchParams.get('booking_id');

    const where = booking_id ? { booking_id } : {};

    const payments = await db.payment.findMany({
      where,
      include: { booking: { include: { car: true } } },
      orderBy: { createdat: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Payments GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pembayaran' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await requireAuth(request);
    const body = await request.json();

    if (!body.booking_id || !body.user_id) {
      return NextResponse.json({ error: 'Data pembayaran tidak lengkap' }, { status: 400 });
    }

    if (authUser.id !== body.user_id && authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Anda tidak memiliki akses untuk membuat pembayaran ini' }, { status: 403 });
    }

    const payment = await db.payment.create({
      data: {
        booking_id: body.booking_id,
        user_id: body.user_id,
        metode: body.metode || 'Transfer Bank',
        jumlah_bayar: body.jumlah_bayar || 0,
        bukti_bayar_url: body.bukti_bayar_url || '',
        status: 'Menunggu Verifikasi',
        tanggal_bayar: new Date().toISOString().split('T')[0],
      },
    });

    await db.booking.update({
      where: { id: body.booking_id },
      data: { status_pembayaran: 'Menunggu Verifikasi' },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Silakan login')) return handleAuthError(error);
    console.error('Payments POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat pembayaran' }, { status: 500 });
  }
}
