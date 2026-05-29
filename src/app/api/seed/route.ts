import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hashPassword, requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    // Clear existing data
    await db.handover.deleteMany();
    await db.payment.deleteMany();
    await db.booking.deleteMany();
    await db.car.deleteMany();
    await db.user.deleteMany();
    await db.settings.deleteMany();

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await db.user.create({
      data: {
        nama: 'Admin Qia Trans',
        email: 'admin@qiatrans.com',
        no_wa: '6281234567890',
        password: adminPassword,
        role: 'admin',
      },
    });

    // Create customer user
    const customerPassword = await hashPassword('customer123');
    const customer = await db.user.create({
      data: {
        nama: 'Budi Santoso',
        email: 'customer@test.com',
        no_wa: '6289876543210',
        password: customerPassword,
        role: 'customer',
      },
    });

    // Create 6 sample cars
    const cars = await Promise.all([
      db.car.create({
        data: {
          nama_mobil: 'Toyota Avanza',
          merk: 'Toyota',
          tipe: 'MPV',
          tahun: 2023,
          transmisi: 'Automatic',
          kapasitas: 7,
          nomor_polisi: 'B 1234 ABC',
          warna: 'Putih',
          harga_harian: 350000,
          harga_sopir: 150000,
          deposit: 500000,
          biaya_antar_jemput: 100000,
          status: 'Tersedia',
          foto_url: '/uploads/logo.png',
          deskripsi: 'Mobil keluarga yang nyaman dan irit bbm. Cocok untuk perjalanan dalam maupun luar kota.',
        },
      }),
      db.car.create({
        data: {
          nama_mobil: 'Honda Jazz',
          merk: 'Honda',
          tipe: 'Hatchback',
          tahun: 2022,
          transmisi: 'Automatic',
          kapasitas: 5,
          nomor_polisi: 'B 5678 DEF',
          warna: 'Hitam',
          harga_harian: 300000,
          harga_sopir: 150000,
          deposit: 400000,
          biaya_antar_jemput: 100000,
          status: 'Tersedia',
          foto_url: '/uploads/logo.png',
          deskripsi: 'City car yang sporty dan modern. Cocok untuk perjalanan di dalam kota.',
        },
      }),
      db.car.create({
        data: {
          nama_mobil: 'Mitsubishi Xpander',
          merk: 'Mitsubishi',
          tipe: 'MPV',
          tahun: 2024,
          transmisi: 'Automatic',
          kapasitas: 7,
          nomor_polisi: 'B 9012 GHI',
          warna: 'Silver',
          harga_harian: 400000,
          harga_sopir: 150000,
          deposit: 500000,
          biaya_antar_jemput: 100000,
          status: 'Disewa',
          foto_url: '/uploads/logo.png',
          deskripsi: 'MPV premium dengan fitur lengkap. Ideal untuk keluarga dan perjalanan jarak jauh.',
        },
      }),
      db.car.create({
        data: {
          nama_mobil: 'Toyota Innova Reborn',
          merk: 'Toyota',
          tipe: 'MPV',
          tahun: 2023,
          transmisi: 'Manual',
          kapasitas: 7,
          nomor_polisi: 'B 3456 JKL',
          warna: 'Abu-abu',
          harga_harian: 450000,
          harga_sopir: 150000,
          deposit: 600000,
          biaya_antar_jemput: 150000,
          status: 'Tersedia',
          foto_url: '/uploads/logo.png',
          deskripsi: 'Mobil premium untuk perjalanan bisnis dan keluarga. Kabin luas dan nyaman.',
        },
      }),
      db.car.create({
        data: {
          nama_mobil: 'Suzuki Ertiga',
          merk: 'Suzuki',
          tipe: 'MPV',
          tahun: 2023,
          transmisi: 'Automatic',
          kapasitas: 7,
          nomor_polisi: 'B 7890 MNO',
          warna: 'Merah',
          harga_harian: 325000,
          harga_sopir: 150000,
          deposit: 450000,
          biaya_antar_jemput: 100000,
          status: 'Maintenance',
          foto_url: '/uploads/logo.png',
          deskripsi: 'Mobil keluarga ekonomis yang handal. Perawatan rutin dilakukan secara berkala.',
        },
      }),
      db.car.create({
        data: {
          nama_mobil: 'Daihatsu Xenia',
          merk: 'Daihatsu',
          tipe: 'MPV',
          tahun: 2022,
          transmisi: 'Manual',
          kapasitas: 7,
          nomor_polisi: 'B 2345 PQR',
          warna: 'Putih',
          harga_harian: 275000,
          harga_sopir: 150000,
          deposit: 350000,
          biaya_antar_jemput: 100000,
          status: 'Tersedia',
          foto_url: '/uploads/logo.png',
          deskripsi: 'Mobil keluarga dengan harga terjangkau. Nyaman untuk perjalanan harian.',
        },
      }),
    ]);

    // Create default settings
    await db.settings.create({
      data: {
        nama_perusahaan: 'Qia Trans',
        nama_aplikasi: 'Booking MobilKu',
        no_wa_admin: '6281234567890',
        alamat_perusahaan: 'Jl. Raya Sewa Mobil No. 123, Jakarta Selatan',
        rekening_bank: 'BCA - 1234567890 a.n. Qia Trans',
        qris_url: '/uploads/logo.png',
        logo_url: '/uploads/logo.png',
        warna_utama: '#0f172a',
      },
    });

    // Create sample bookings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    await db.booking.create({
      data: {
        kode_booking: `QT-${formatDate(today).replace(/-/g, '')}-0001`,
        user_id: customer.id,
        car_id: cars[2].id, // Xpander yang disewa
        nama_penyewa: 'Budi Santoso',
        no_wa: '6289876543210',
        alamat: 'Jl. Merdeka No. 10, Jakarta',
        nik: '3201234567890001',
        no_sim: '320100000001',
        tanggal_mulai: formatDate(today),
        jam_mulai: '08:00',
        tanggal_selesai: formatDate(dayAfter),
        jam_selesai: '08:00',
        durasi_hari: 3,
        jenis_sewa: 'dengan_sopir',
        lokasi_jemput: 'Bandara Soekarno-Hatta',
        biaya_sewa: 1200000,
        biaya_sopir: 450000,
        biaya_antar_jemput: 100000,
        deposit: 500000,
        total_biaya: 2250000,
        status_booking: 'Sedang Disewa',
        status_pembayaran: 'Lunas',
      },
    });

    await db.booking.create({
      data: {
        kode_booking: `QT-${formatDate(today).replace(/-/g, '')}-0002`,
        user_id: customer.id,
        car_id: cars[0].id, // Avanza
        nama_penyewa: 'Budi Santoso',
        no_wa: '6289876543210',
        alamat: 'Jl. Merdeka No. 10, Jakarta',
        nik: '3201234567890001',
        no_sim: '320100000001',
        tanggal_mulai: formatDate(nextWeek),
        jam_mulai: '09:00',
        tanggal_selesai: formatDate(new Date(nextWeek.getTime() + 2 * 86400000)),
        jam_selesai: '09:00',
        durasi_hari: 2,
        jenis_sewa: 'lepas_kunci',
        lokasi_jemput: 'Kantor Qia Trans',
        biaya_sewa: 700000,
        biaya_sopir: 0,
        biaya_antar_jemput: 0,
        deposit: 500000,
        total_biaya: 1200000,
        status_booking: 'Dikonfirmasi',
        status_pembayaran: 'DP Diterima',
      },
    });

    return NextResponse.json({
      message: 'Database berhasil di-seed!',
      data: {
        users: 2,
        cars: cars.length,
        bookings: 2,
        settings: 1,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Gagal melakukan seed database' }, { status: 500 });
  }
}
