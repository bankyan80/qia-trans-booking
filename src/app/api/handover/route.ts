import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const booking_id = searchParams.get('booking_id');

    const where = booking_id ? { booking_id } : {};

    const handovers = await db.handover.findMany({
      where,
      include: { booking: { include: { car: true } } },
      orderBy: { createdat: 'desc' },
    });

    return NextResponse.json(handovers);
  } catch (error) {
    console.error('Handovers GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data serah terima' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = await request.json();

    if (!body.booking_id) {
      return NextResponse.json({ error: 'Booking ID harus diisi' }, { status: 400 });
    }

    const handover = await db.handover.create({
      data: {
        booking_id: body.booking_id,
        km_awal: body.km_awal || 0,
        km_akhir: body.km_akhir || 0,
        bbm_awal: body.bbm_awal || '',
        bbm_akhir: body.bbm_akhir || '',
        foto_awal_url: body.foto_awal_url || '',
        foto_akhir_url: body.foto_akhir_url || '',
        catatan_awal: body.catatan_awal || '',
        catatan_akhir: body.catatan_akhir || '',
        denda: body.denda || 0,
        denda_keterangan: body.denda_keterangan || '',
        status_deposit: body.status_deposit || 'Belum Dikembalikan',
      },
    });

    return NextResponse.json(handover, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Handovers POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat serah terima' }, { status: 500 });
  }
}
