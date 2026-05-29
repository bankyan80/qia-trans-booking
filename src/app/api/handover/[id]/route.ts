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

    const existingHandover = await db.handover.findUnique({ where: { id } });
    if (!existingHandover) {
      return NextResponse.json({ error: 'Serah terima tidak ditemukan' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.km_awal !== undefined) updateData.km_awal = body.km_awal;
    if (body.km_akhir !== undefined) updateData.km_akhir = body.km_akhir;
    if (body.bbm_awal !== undefined) updateData.bbm_awal = body.bbm_awal;
    if (body.bbm_akhir !== undefined) updateData.bbm_akhir = body.bbm_akhir;
    if (body.foto_awal_url !== undefined) updateData.foto_awal_url = body.foto_awal_url;
    if (body.foto_akhir_url !== undefined) updateData.foto_akhir_url = body.foto_akhir_url;
    if (body.catatan_awal !== undefined) updateData.catatan_awal = body.catatan_awal;
    if (body.catatan_akhir !== undefined) updateData.catatan_akhir = body.catatan_akhir;
    if (body.denda !== undefined) updateData.denda = body.denda;
    if (body.denda_keterangan !== undefined) updateData.denda_keterangan = body.denda_keterangan;
    if (body.status_deposit !== undefined) updateData.status_deposit = body.status_deposit;

    const handover = await db.handover.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(handover);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Handover PUT error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate serah terima' }, { status: 500 });
  }
}
