import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAuth, requireAdmin, handleAuthError } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const car_id = searchParams.get('car_id');
    const status = searchParams.get('status');

    const where: Record<string, string> = {};
    if (user_id) where.user_id = user_id;
    if (car_id) where.car_id = car_id;
    if (status) where.status_booking = status;

    const bookings = await db.booking.findMany({
      where,
      include: {
        car: true,
        user: { select: { id: true, nama: true, email: true, no_wa: true } },
      },
      orderBy: { createdat: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data booking' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await requireAuth(request);
    const body = await request.json();

    // Validate required fields
    if (!body.car_id || !body.user_id || !body.nama_penyewa || !body.no_wa || !body.tanggal_mulai || !body.tanggal_selesai) {
      return NextResponse.json({ error: 'Data booking tidak lengkap' }, { status: 400 });
    }

    if (authUser.id !== body.user_id && authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Anda tidak dapat membuat booking untuk pengguna lain' }, { status: 403 });
    }

    // Get car data
    const car = await db.car.findUnique({ where: { id: body.car_id } });
    if (!car) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    // Validate NIK for lepas kunci
    if (body.jenis_sewa === 'lepas_kunci') {
      if (!body.nik || body.nik.length !== 16) {
        return NextResponse.json({ error: 'NIK harus 16 digit untuk sewa lepas kunci' }, { status: 400 });
      }
    }

    // Calculate duration
    const startDate = new Date(body.tanggal_mulai);
    const endDate = new Date(body.tanggal_selesai);
    const diffTime = endDate.getTime() - startDate.getTime();
    const durasi_hari = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Check date conflicts
    const conflictingBookings = await db.booking.findMany({
      where: {
        car_id: body.car_id,
        status_booking: { notIn: ['Ditolak', 'Dibatalkan'] },
        OR: [
          {
            tanggal_mulai: { lte: body.tanggal_selesai },
            tanggal_selesai: { gte: body.tanggal_mulai },
          },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return NextResponse.json({ error: 'Tanggal sewa bentrok dengan booking yang sudah ada' }, { status: 400 });
    }

    // Calculate costs
    const biaya_sewa = car.harga_harian * durasi_hari;
    const biaya_sopir = body.jenis_sewa === 'dengan_sopir' ? car.harga_sopir * durasi_hari : 0;
    const biaya_antar_jemput = body.lokasi_jemput && body.lokasi_jemput !== 'Kantor Qia Trans' ? car.biaya_antar_jemput : 0;
    const deposit = car.deposit;
    const total_biaya = biaya_sewa + biaya_sopir + biaya_antar_jemput + deposit;

    // Generate kode_booking
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const random4 = Math.floor(1000 + Math.random() * 9000).toString();
    const kode_booking = `QT-${dateStr}-${random4}`;

    const booking = await db.booking.create({
      data: {
        kode_booking,
        user_id: body.user_id,
        car_id: body.car_id,
        nama_penyewa: body.nama_penyewa,
        no_wa: body.no_wa,
        alamat: body.alamat || '',
        nik: body.nik || '',
        no_sim: body.no_sim || '',
        ktp_url: body.ktp_url || '',
        sim_url: body.sim_url || '',
        tanggal_mulai: body.tanggal_mulai,
        jam_mulai: body.jam_mulai || '08:00',
        tanggal_selesai: body.tanggal_selesai,
        jam_selesai: body.jam_selesai || '08:00',
        durasi_hari,
        jenis_sewa: body.jenis_sewa || 'lepas_kunci',
        lokasi_jemput: body.lokasi_jemput || '',
        biaya_sewa,
        biaya_sopir,
        biaya_antar_jemput,
        deposit,
        total_biaya,
        status_booking: 'Menunggu Konfirmasi',
        status_pembayaran: 'Belum Bayar',
      },
      include: {
        car: true,
        user: { select: { id: true, nama: true, email: true, no_wa: true } },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Bookings POST error:', error);
    return NextResponse.json({ error: 'Gagal membuat booking' }, { status: 500 });
  }
}
