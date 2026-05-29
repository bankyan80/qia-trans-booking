'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, Download } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate, formatDateLong, getStatusColor } from '@/lib/helpers'

interface InvoiceViewProps {
  navigate: (view: string) => void
}

export function InvoiceView({ navigate }: InvoiceViewProps) {
  const selectedBooking = useStore(s => s.selectedBooking)
  const settings = useStore(s => s.settings)

  if (!selectedBooking) return null
  const booking = selectedBooking

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('bookingDetail')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 py-2">
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="w-3 h-3 mr-1" /> Cetak
        </Button>
      </div>

      <Card className="p-6 border-slate-200 print:shadow-none print:border-slate-300" id="invoice-print">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-wider">QIA TRANS</h1>
          <p className="text-slate-500 text-sm">Booking MobilKu</p>
          <Separator className="my-3" />
          <h2 className="text-lg font-semibold text-slate-700">Invoice Booking Sewa Mobil</h2>
        </div>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500">Kode Booking</p>
              <p className="font-bold text-slate-900">{booking.kode_booking}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Tanggal Booking</p>
              <p className="font-medium">{formatDate(booking.createdat)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Data Penyewa</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><p className="text-slate-500">Nama</p><p>{booking.nama_penyewa}</p></div>
              <div><p className="text-slate-500">No. WA</p><p>{booking.no_wa}</p></div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Detail Sewa</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><p className="text-slate-500">Mobil</p><p className="font-medium">{booking.car?.nama_mobil}</p></div>
              <div><p className="text-slate-500">Jenis Sewa</p><p>{booking.jenis_sewa === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}</p></div>
              <div><p className="text-slate-500">Tanggal Mulai</p><p>{formatDateLong(booking.tanggal_mulai)} {booking.jam_mulai}</p></div>
              <div><p className="text-slate-500">Tanggal Selesai</p><p>{formatDateLong(booking.tanggal_selesai)} {booking.jam_selesai}</p></div>
              <div><p className="text-slate-500">Durasi</p><p>{booking.durasi_hari} hari</p></div>
              <div><p className="text-slate-500">Lokasi Jemput</p><p>{booking.lokasi_jemput || '-'}</p></div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Rincian Biaya</h3>
            <div className="space-y-1">
              <div className="flex justify-between"><span>Biaya Sewa</span><span>Rp {formatCurrency(booking.biaya_sewa)}</span></div>
              {booking.biaya_sopir > 0 && <div className="flex justify-between"><span>Biaya Sopir</span><span>Rp {formatCurrency(booking.biaya_sopir)}</span></div>}
              {booking.biaya_antar_jemput > 0 && <div className="flex justify-between"><span>Antar Jemput</span><span>Rp {formatCurrency(booking.biaya_antar_jemput)}</span></div>}
              <div className="flex justify-between"><span>Deposit</span><span>Rp {formatCurrency(booking.deposit)}</span></div>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg"><span>TOTAL</span><span className="text-slate-900">Rp {formatCurrency(booking.total_biaya)}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-slate-500">Status Booking</p>
              <Badge className={getStatusColor(booking.status_booking)}>{booking.status_booking}</Badge>
            </div>
            <div>
              <p className="text-slate-500">Status Pembayaran</p>
              <Badge className={getStatusColor(booking.status_pembayaran)}>{booking.status_pembayaran}</Badge>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">Terima kasih telah mempercayakan perjalanan Anda kepada Qia Trans</p>
          <p className="text-xs text-slate-400">{settings?.alamat_perusahaan}</p>
          <p className="text-xs text-slate-400">WA: {settings?.no_wa_admin}</p>
        </div>
      </Card>
    </div>
  )
}
