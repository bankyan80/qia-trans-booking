import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const existingPayment = await db.payment.findUnique({ where: { id } });
    if (!existingPayment) {
      return NextResponse.json({ error: 'Pembayaran tidak ditemukan' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.bukti_bayar_url !== undefined) updateData.bukti_bayar_url = body.bukti_bayar_url;
    if (body.jumlah_bayar !== undefined) updateData.jumlah_bayar = body.jumlah_bayar;
    if (body.metode !== undefined) updateData.metode = body.metode;

    if (body.status === 'Lunas' || body.status === 'DP Diterima') {
      updateData.verified_at = new Date().toISOString();
    }

    const payment = await db.payment.update({
      where: { id },
      data: updateData,
    });

    // Update booking payment status based on payment status
    if (body.status === 'DP Diterima') {
      await db.booking.update({
        where: { id: existingPayment.booking_id },
        data: { status_pembayaran: 'DP Diterima' },
      });
    } else if (body.status === 'Lunas') {
      await db.booking.update({
        where: { id: existingPayment.booking_id },
        data: { status_pembayaran: 'Lunas' },
      });
    } else if (body.status === 'Ditolak') {
      await db.booking.update({
        where: { id: existingPayment.booking_id },
        data: { status_pembayaran: 'Ditolak' },
      });
    }

    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Payment PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate pembayaran' }, { status: 500 });
  }
}
