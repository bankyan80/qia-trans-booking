import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = await db.car.findUnique({ where: { id } });

    if (!car) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Car GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data mobil' }, { status: 500 });
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

    const existingCar = await db.car.findUnique({ where: { id } });
    if (!existingCar) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    const car = await db.car.update({
      where: { id },
      data: {
        nama_mobil: body.nama_mobil,
        merk: body.merk,
        tipe: body.tipe,
        tahun: body.tahun,
        transmisi: body.transmisi,
        kapasitas: body.kapasitas,
        nomor_polisi: body.nomor_polisi,
        warna: body.warna,
        harga_harian: body.harga_harian,
        harga_sopir: body.harga_sopir,
        deposit: body.deposit,
        biaya_antar_jemput: body.biaya_antar_jemput,
        status: body.status,
        foto_url: body.foto_url,
        deskripsi: body.deskripsi,
      },
    });

    return NextResponse.json(car);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Car PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate mobil' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const existingCar = await db.car.findUnique({ where: { id } });
    if (!existingCar) {
      return NextResponse.json({ error: 'Mobil tidak ditemukan' }, { status: 404 });
    }

    await db.car.delete({ where: { id } });

    return NextResponse.json({ message: 'Mobil berhasil dihapus' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Car DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus mobil' }, { status: 500 });
  }
}
