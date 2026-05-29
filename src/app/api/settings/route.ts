import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await db.settings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await db.settings.create({
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
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil pengaturan' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin(request);
    const body = await request.json();

    const existing = await db.settings.findFirst();

    if (!existing) {
      const settings = await db.settings.create({ data: body });
      return NextResponse.json(settings);
    }

    const settings = await db.settings.update({
      where: { id: existing.id },
      data: {
        nama_perusahaan: body.nama_perusahaan,
        nama_aplikasi: body.nama_aplikasi,
        no_wa_admin: body.no_wa_admin,
        alamat_perusahaan: body.alamat_perusahaan,
        rekening_bank: body.rekening_bank,
        qris_url: body.qris_url,
        logo_url: body.logo_url,
        warna_utama: body.warna_utama,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate pengaturan' }, { status: 500 });
  }
}
