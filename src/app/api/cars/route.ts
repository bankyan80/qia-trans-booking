import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const cars = await db.car.findMany({
      where,
      orderBy: { createdat: 'desc' },
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Cars GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data mobil' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request);

    const body = await request.json();

    const car = await db.car.create({
      data: {
        nama_mobil: body.nama_mobil,
        merk: body.merk,
        tipe: body.tipe || '',
        tahun: body.tahun || 2024,
        transmisi: body.transmisi || 'Automatic',
        kapasitas: body.kapasitas || 5,
        nomor_polisi: body.nomor_polisi,
        warna: body.warna || '',
        harga_harian: body.harga_harian || 0,
        harga_sopir: body.harga_sopir || 0,
        deposit: body.deposit || 0,
        biaya_antar_jemput: body.biaya_antar_jemput || 0,
        status: body.status || 'Tersedia',
        foto_url: body.foto_url || '',
        deskripsi: body.deskripsi || '',
      },
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Cars POST error:', error);
    return NextResponse.json({ error: 'Gagal menambah mobil' }, { status: 500 });
  }
}
