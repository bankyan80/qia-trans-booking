'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Calendar } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/helpers'

interface MyBookingsViewProps {
  navigate: (view: string) => void
}

export function MyBookingsView({ navigate }: MyBookingsViewProps) {
  const user = useStore(s => s.user)
  const bookings = useStore(s => s.bookings)
  const setSelectedBooking = useStore(s => s.setSelectedBooking)

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Booking Saya</h1>

      {bookings.length === 0 ? (
        <Card className="p-8 text-center border-slate-100">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 mb-3">Belum ada booking</p>
          <Button className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => navigate('home')}>Booking Sekarang</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map(booking => (
            <Card key={booking.id} className="p-4 border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedBooking(booking); navigate('bookingDetail') }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{booking.car?.nama_mobil || 'Mobil'}</p>
                  <p className="text-xs text-slate-500">{booking.kode_booking}</p>
                </div>
                <Badge className={`${getStatusColor(booking.status_booking)} text-xs`}>{booking.status_booking}</Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(booking.tanggal_mulai)} - {formatDate(booking.tanggal_selesai)}</span>
                <span>{booking.durasi_hari} hari</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{booking.jenis_sewa === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}</span>
                <span className="font-bold text-sm text-slate-900">Rp {formatCurrency(booking.total_biaya)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
