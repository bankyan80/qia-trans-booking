import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const totalCars = await db.car.count();
    const availableCars = await db.car.count({ where: { status: 'Tersedia' } });
    const rentedCars = await db.car.count({ where: { status: 'Disewa' } });
    const maintenanceCars = await db.car.count({ where: { status: 'Maintenance' } });

    const today = new Date().toISOString().split('T')[0];
    const todayBookings = await db.booking.count({
      where: {
        OR: [
          { tanggal_mulai: today },
          { tanggal_selesai: today },
        ],
      },
    });

    // Monthly revenue - current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const monthlyBookings = await db.booking.findMany({
      where: {
        tanggal_mulai: { gte: firstDayOfMonth },
        tanggal_selesai: { lte: lastDayOfMonth },
        status_booking: { notIn: ['Ditolak', 'Dibatalkan'] },
      },
    });

    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + b.total_biaya, 0);

    // Recent bookings
    const recentBookings = await db.booking.findMany({
      take: 10,
      orderBy: { createdat: 'desc' },
      include: {
        car: true,
        user: { select: { id: true, nama: true, no_wa: true } },
      },
    });

    // Booking stats by status
    const bookingStatusCounts = await db.booking.groupBy({
      by: ['status_booking'],
      _count: { status_booking: true },
    });

    return NextResponse.json({
      totalCars,
      availableCars,
      rentedCars,
      maintenanceCars,
      todayBookings,
      monthlyRevenue,
      recentBookings,
      bookingStatusCounts,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Akses ditolak')) return handleAuthError(error);
    console.error('Dashboard GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data dashboard' }, { status: 500 });
  }
}
