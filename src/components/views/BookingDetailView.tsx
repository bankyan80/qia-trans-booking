'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, FileText, MessageCircle, XCircle, CreditCard } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/helpers'

interface BookingDetailViewProps {
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

export function BookingDetailView({ navigate }: BookingDetailViewProps) {
  const { toast } = useToast()
  const selectedBooking = useStore(s => s.selectedBooking)
  const settings = useStore(s => s.settings)
  const paymentForm = useStore(s => s.paymentForm)
  const setPaymentForm = useStore(s => s.setPaymentForm)
  const handleCreatePayment = useStore(s => s.handleCreatePayment)
  const handleUpdateBookingStatus = useStore(s => s.handleUpdateBookingStatus)
  const fetchMyBookings = useStore(s => s.fetchMyBookings)
  const uploadFile = useStore(s => s.uploadFile)
  const openWhatsApp = useStore(s => s.openWhatsApp)
  const user = useStore(s => s.user)

  const handleCancelBooking = async () => {
    if (!selectedBooking) return
    if (!confirm('Yakin ingin membatalkan booking ini?')) return
    try {
      await handleUpdateBookingStatus(selectedBooking.id, 'Dibatalkan')
      toast({ title: 'Booking Dibatalkan' })
      if (user) fetchMyBookings(user.id)
      navigate('myBookings')
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }

  const handlePaymentSubmit = async () => {
    if (!user || !selectedBooking) return
    try {
      await handleCreatePayment(selectedBooking.id, user.id, paymentForm)
      toast({ title: 'Pembayaran Berhasil Dikirim', description: 'Menunggu verifikasi admin' })
      if (user) fetchMyBookings(user.id)
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }

  if (!selectedBooking) return null
  const booking = selectedBooking

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-4">
      <button onClick={() => navigate('myBookings')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 py-2">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Detail Booking</h1>
          <p className="text-sm text-slate-500">{booking.kode_booking}</p>
        </div>
        <Badge className={getStatusColor(booking.status_booking)}>{booking.status_booking}</Badge>
      </div>

      <Card className="p-4 border-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-900">Informasi Mobil</h3>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">Mobil</span><span className="font-medium">{booking.car?.nama_mobil}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Jenis Sewa</span><span>{booking.jenis_sewa === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Tanggal Mulai</span><span>{formatDate(booking.tanggal_mulai)} {booking.jam_mulai}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Tanggal Selesai</span><span>{formatDate(booking.tanggal_selesai)} {booking.jam_selesai}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Durasi</span><span>{booking.durasi_hari} hari</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Lokasi Jemput</span><span>{booking.lokasi_jemput || '-'}</span></div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-900">Data Penyewa</h3>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">Nama</span><span>{booking.nama_penyewa}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">WhatsApp</span><span>{booking.no_wa}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">NIK</span><span>{booking.nik || '-'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Alamat</span><span className="text-right max-w-[60%]">{booking.alamat || '-'}</span></div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-2">
        <h3 className="font-semibold text-slate-900">Rincian Biaya</h3>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">Biaya Sewa</span><span>Rp {formatCurrency(booking.biaya_sewa)}</span></div>
          {booking.biaya_sopir > 0 && <div className="flex justify-between"><span className="text-slate-500">Biaya Sopir</span><span>Rp {formatCurrency(booking.biaya_sopir)}</span></div>}
          {booking.biaya_antar_jemput > 0 && <div className="flex justify-between"><span className="text-slate-500">Antar Jemput</span><span>Rp {formatCurrency(booking.biaya_antar_jemput)}</span></div>}
          <div className="flex justify-between"><span className="text-slate-500">Deposit</span><span>Rp {formatCurrency(booking.deposit)}</span></div>
          <Separator />
          <div className="flex justify-between font-bold"><span>Total</span><span>Rp {formatCurrency(booking.total_biaya)}</span></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-slate-500">Status Pembayaran</span>
          <Badge className={getStatusColor(booking.status_pembayaran)}>{booking.status_pembayaran}</Badge>
        </div>
      </Card>

      <div className="flex gap-3">
        {(booking.status_booking === 'Menunggu Konfirmasi' || booking.status_booking === 'Dikonfirmasi' || booking.status_booking === 'Menunggu Pembayaran') && (
          <Button className="flex-1 h-12 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => navigate('invoice')}>
            <FileText className="w-4 h-4 mr-2" /> Lihat Invoice
          </Button>
        )}
        <Button variant="outline" className="h-12" onClick={() => openWhatsApp(settings?.no_wa_admin || '6281234567890', generateBookingMessage(booking))}>
          <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
        </Button>
        {(booking.status_booking === 'Menunggu Konfirmasi' || booking.status_booking === 'Dikonfirmasi') && (
          <Button variant="outline" className="h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleCancelBooking}>
            <XCircle className="w-4 h-4 mr-2" /> Batal
          </Button>
        )}
      </div>

      {(booking.status_booking === 'Dikonfirmasi' || booking.status_booking === 'Menunggu Pembayaran') && booking.status_pembayaran !== 'Lunas' && booking.status_pembayaran !== 'DP Diterima' && (
        <Card className="p-4 border-slate-100 space-y-3">
          <h3 className="font-semibold text-slate-900">Upload Bukti Pembayaran</h3>
          {settings?.rekening_bank && (
            <div className="bg-slate-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-slate-900">Transfer ke:</p>
              <p className="text-slate-600">{settings.rekening_bank}</p>
            </div>
          )}
          <div className="space-y-2">
            <Select value={paymentForm.metode} onValueChange={v => setPaymentForm(prev => ({ ...prev, metode: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Transfer Bank">Transfer Bank</SelectItem>
                <SelectItem value="QRIS">QRIS</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-1">
              <Label className="text-xs">Jumlah Bayar</Label>
              <Input type="number" value={paymentForm.jumlah_bayar || ''} onChange={e => setPaymentForm(prev => ({ ...prev, jumlah_bayar: Number(e.target.value) }))} placeholder="Jumlah yang dibayar" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bukti Pembayaran</Label>
              <Input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  try {
                    const url = await uploadFile(file)
                    setPaymentForm(prev => ({ ...prev, bukti_bayar_url: url }))
                    toast({ title: 'Bukti berhasil diupload' })
                  } catch { toast({ title: 'Gagal upload bukti', variant: 'destructive' }) }
                }
              }} />
              {paymentForm.bukti_bayar_url && <p className="text-xs text-green-600">✓ Bukti sudah diupload</p>}
            </div>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handlePaymentSubmit}>
            <CreditCard className="w-4 h-4 mr-2" /> Kirim Bukti Pembayaran
          </Button>
        </Card>
      )}
    </div>
  )
}
