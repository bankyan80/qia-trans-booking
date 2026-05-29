import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        car: true,
        user: { select: { id: true, nama: true, email: true, no_wa: true } },
        payments: true,
        handovers: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data booking' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const existingBooking = await db.booking.findUnique({ where: { id } });
    if (!existingBooking) {
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.status_booking !== undefined) updateData.status_booking = body.status_booking;
    if (body.status_pembayaran !== undefined) updateData.status_pembayaran = body.status_pembayaran;
    if (body.ktp_url !== undefined) updateData.ktp_url = body.ktp_url;
    if (body.sim_url !== undefined) updateData.sim_url = body.sim_url;
    if (body.nama_penyewa !== undefined) updateData.nama_penyewa = body.nama_penyewa;
    if (body.no_wa !== undefined) updateData.no_wa = body.no_wa;
    if (body.alamat !== undefined) updateData.alamat = body.alamat;
    if (body.nik !== undefined) updateData.nik = body.nik;
    if (body.no_sim !== undefined) updateData.no_sim = body.no_sim;

    // If booking is confirmed, update car status to Disewa
    if (body.status_booking === 'Dikonfirmasi' || body.status_booking === 'Sedang Disewa') {
      await db.car.update({
        where: { id: existingBooking.car_id },
        data: { status: 'Disewa' },
      });
    }

    // If booking is completed or cancelled, return car to Tersedia
    if (body.status_booking === 'Selesai' || body.status_booking === 'Dibatalkan') {
      await db.car.update({
        where: { id: existingBooking.car_id },
        data: { status: 'Tersedia' },
      });
    }

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
      include: {
        car: true,
        user: { select: { id: true, nama: true, email: true, no_wa: true } },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate booking' }, { status: 500 });
  }
}
