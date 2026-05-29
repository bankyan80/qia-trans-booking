'use client'

import React, { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Car, Home as HomeIcon, CalendarDays, User, LayoutDashboard, ClipboardList, BarChart3, Settings,
  ChevronLeft, Phone, MessageCircle, Plus, Edit, Trash2, Eye, CheckCircle, XCircle,
  Clock, MapPin, Users, Fuel, Gauge, Calendar, CreditCard, Upload, FileText, Star,
  LogOut, Shield, Search, Filter, RefreshCw, Download, Send, AlertTriangle,
  ChevronRight, PhoneCall, Wrench
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate, formatDateLong, getStatusColor, getCarImage, apiFetch } from '@/lib/helpers'

interface AdminBookingDetailViewProps {
  navigate: (view: string) => void
}

function generateBookingMessage(booking: {
  nama_penyewa: string
  car?: { nama_mobil?: string }
  tanggal_mulai: string
  tanggal_selesai: string
  durasi_hari: number
  jenis_sewa: string
  total_biaya: number
  status_booking: string
}): string {
  return `*Qia Trans – Booking MobilKu*
Nama: ${booking.nama_penyewa}
Mobil: ${booking.car?.nama_mobil || '-'}
Tanggal Sewa: ${formatDate(booking.tanggal_mulai)}
Tanggal Kembali: ${formatDate(booking.tanggal_selesai)}
Durasi: ${booking.durasi_hari} hari
Jenis Sewa: ${booking.jenis_sewa === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}
Total Biaya: Rp ${formatCurrency(booking.total_biaya)}
Status: ${booking.status_booking}`
}

export function AdminBookingDetailView({ navigate }: AdminBookingDetailViewProps) {
  const { toast } = useToast()
  const selectedBooking = useStore(s => s.selectedBooking)
  const settings = useStore(s => s.settings)
  const fetchAllBookings = useStore(s => s.fetchAllBookings)
  const fetchDashboard = useStore(s => s.fetchDashboard)
  const fetchMyBookings = useStore(s => s.fetchMyBookings)
  const handleUpdateBookingStatus = useStore(s => s.handleUpdateBookingStatus)
  const handleUpdatePaymentStatus = useStore(s => s.handleUpdatePaymentStatus)
  const openWhatsApp = useStore(s => s.openWhatsApp)

  const updateBookingStatus = useCallback(async (bookingId: string, status_booking: string) => {
    try {
      await handleUpdateBookingStatus(bookingId, status_booking)
      toast({ title: 'Status Diperbarui', description: `Booking ${status_booking}` })
      fetchAllBookings()
      fetchDashboard()
      fetchMyBookings('')
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }, [handleUpdateBookingStatus, fetchAllBookings, fetchDashboard, fetchMyBookings, toast])

  const updatePaymentStatus = useCallback(async (paymentId: string, status: string) => {
    try {
      await handleUpdatePaymentStatus(paymentId, status)
      toast({ title: 'Pembayaran Diperbarui' })
      fetchAllBookings()
      fetchMyBookings('')
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }, [handleUpdatePaymentStatus, fetchAllBookings, fetchMyBookings, toast])

  if (!selectedBooking) return null
  const booking = selectedBooking

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 lg:ml-64 space-y-4">
      <button onClick={() => navigate('adminBookings')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 py-2">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Detail Booking</h1>
          <p className="text-sm text-slate-500">{booking.kode_booking}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(booking.status_booking)}>{booking.status_booking}</Badge>
          <Badge className={getStatusColor(booking.status_pembayaran)}>{booking.status_pembayaran}</Badge>
        </div>
      </div>

      <Card className="p-4 border-slate-100 space-y-2 text-sm">
        <h3 className="font-semibold text-slate-900">Informasi Booking</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><p className="text-slate-500">Penyewa</p><p className="font-medium">{booking.nama_penyewa}</p></div>
          <div><p className="text-slate-500">WhatsApp</p><p>{booking.no_wa}</p></div>
          <div><p className="text-slate-500">Mobil</p><p className="font-medium">{booking.car?.nama_mobil}</p></div>
          <div><p className="text-slate-500">Jenis Sewa</p><p>{booking.jenis_sewa === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}</p></div>
          <div><p className="text-slate-500">Tanggal Mulai</p><p>{formatDate(booking.tanggal_mulai)} {booking.jam_mulai}</p></div>
          <div><p className="text-slate-500">Tanggal Selesai</p><p>{formatDate(booking.tanggal_selesai)} {booking.jam_selesai}</p></div>
          <div><p className="text-slate-500">Durasi</p><p>{booking.durasi_hari} hari</p></div>
          <div><p className="text-slate-500">Lokasi Jemput</p><p>{booking.lokasi_jemput || '-'}</p></div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-2 text-sm">
        <h3 className="font-semibold text-slate-900">Rincian Biaya</h3>
        <div className="space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">Biaya Sewa</span><span>Rp {formatCurrency(booking.biaya_sewa)}</span></div>
          {booking.biaya_sopir > 0 && <div className="flex justify-between"><span className="text-slate-500">Biaya Sopir</span><span>Rp {formatCurrency(booking.biaya_sopir)}</span></div>}
          {booking.biaya_antar_jemput > 0 && <div className="flex justify-between"><span className="text-slate-500">Antar Jemput</span><span>Rp {formatCurrency(booking.biaya_antar_jemput)}</span></div>}
          <div className="flex justify-between"><span className="text-slate-500">Deposit</span><span>Rp {formatCurrency(booking.deposit)}</span></div>
          <Separator />
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>Rp {formatCurrency(booking.total_biaya)}</span></div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-900">Aksi Admin</h3>
        <div className="flex flex-wrap gap-2">
          {booking.status_booking === 'Menunggu Konfirmasi' && (
            <>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateBookingStatus(booking.id, 'Dikonfirmasi')}>
                <CheckCircle className="w-4 h-4 mr-1" /> Terima Booking
              </Button>
              <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => updateBookingStatus(booking.id, 'Ditolak')}>
                <XCircle className="w-4 h-4 mr-1" /> Tolak
              </Button>
            </>
          )}
          {booking.status_booking === 'Dikonfirmasi' && booking.status_pembayaran === 'Lunas' && (
            <Button className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => updateBookingStatus(booking.id, 'Sedang Disewa')}>
              Mulai Sewa
            </Button>
          )}
          {booking.status_booking === 'Dikonfirmasi' && booking.status_pembayaran !== 'Lunas' && (
            <Button variant="outline" onClick={() => updateBookingStatus(booking.id, 'Menunggu Pembayaran')}>
              Tunggu Pembayaran
            </Button>
          )}
          {booking.status_booking === 'Menunggu Pembayaran' && booking.status_pembayaran === 'Lunas' && (
            <Button className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => updateBookingStatus(booking.id, 'Sedang Disewa')}>
              Mulai Sewa
            </Button>
          )}
          {booking.status_booking === 'Sedang Disewa' && (
            <>
              <Button className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => { navigate('adminHandover') }}>
                Serah Terima
              </Button>
              <Button variant="outline" onClick={() => updateBookingStatus(booking.id, 'Selesai')}>
                Selesai
              </Button>
              <Button variant="outline" className="text-amber-600 hover:bg-amber-50" onClick={() => updateBookingStatus(booking.id, 'Bermasalah')}>
                <AlertTriangle className="w-4 h-4 mr-1" /> Bermasalah
              </Button>
            </>
          )}
          {(booking.status_booking === 'Menunggu Konfirmasi' || booking.status_booking === 'Dikonfirmasi' || booking.status_booking === 'Menunggu Pembayaran') && (
            <Button variant="outline" className="text-red-600" onClick={() => updateBookingStatus(booking.id, 'Dibatalkan')}>
              Batalkan
            </Button>
          )}
        </div>
      </Card>

      {booking.payments && booking.payments.length > 0 && (
        <Card className="p-4 border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-900">Pembayaran</h3>
          {booking.payments.map(payment => (
            <div key={payment.id} className="p-3 bg-slate-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{payment.metode} - Rp {formatCurrency(payment.jumlah_bayar)}</span>
                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
              </div>
              {payment.bukti_bayar_url && <img src={payment.bukti_bayar_url} alt="Bukti Bayar" className="w-full max-h-48 object-cover rounded-lg" />}
              <div className="flex gap-2">
                {payment.status === 'Menunggu Verifikasi' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updatePaymentStatus(payment.id, 'Lunas')}>Verifikasi Lunas</Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => updatePaymentStatus(payment.id, 'DP Diterima')}>Verifikasi DP</Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => updatePaymentStatus(payment.id, 'Ditolak')}>Tolak</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => navigate('invoice')}>
          <FileText className="w-4 h-4 mr-2" /> Invoice
        </Button>
        <Button variant="outline" onClick={() => openWhatsApp(settings?.no_wa_admin || '6281234567890', generateBookingMessage(booking))}>
          <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
        </Button>
      </div>
    </div>
  )
}
