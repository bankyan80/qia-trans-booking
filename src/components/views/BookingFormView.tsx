'use client'

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ChevronLeft, Car, Calendar, User, Upload, CreditCard, RefreshCw, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'
import { formatCurrency, getCarImage } from '@/lib/helpers'

interface BookingFormViewProps {
  navigate: (view: string) => void
}

export function BookingFormView({ navigate }: BookingFormViewProps) {
  const { toast } = useToast()
  const selectedCar = useStore(s => s.selectedCar)
  const bookingForm = useStore(s => s.bookingForm)
  const setBookingForm = useStore(s => s.setBookingForm)
  const loading = useStore(s => s.loading)
  const settings = useStore(s => s.settings)
  const user = useStore(s => s.user)
  const uploadFile = useStore(s => s.uploadFile)
  const handleCreateBooking = useStore(s => s.handleCreateBooking)
  const openWhatsApp = useStore(s => s.openWhatsApp)

  const calculateBookingCost = useMemo(() => {
    if (!selectedCar || !bookingForm.tanggal_mulai || !bookingForm.tanggal_selesai) return null
    const start = new Date(bookingForm.tanggal_mulai)
    const end = new Date(bookingForm.tanggal_selesai)
    const diffTime = end.getTime() - start.getTime()
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    const biaya_sewa = selectedCar.harga_harian * days
    const biaya_sopir = bookingForm.jenis_sewa === 'dengan_sopir' ? selectedCar.harga_sopir * days : 0
    const biaya_antar = bookingForm.lokasi_jemput && bookingForm.lokasi_jemput !== 'Kantor Qia Trans' ? selectedCar.biaya_antar_jemput : 0
    const deposit = selectedCar.deposit
    const total = biaya_sewa + biaya_sopir + biaya_antar + deposit
    return { days, biaya_sewa, biaya_sopir, biaya_antar, deposit, total }
  }, [selectedCar, bookingForm.tanggal_mulai, bookingForm.tanggal_selesai, bookingForm.jenis_sewa, bookingForm.lokasi_jemput])

  const cost = calculateBookingCost

  const handleBookingSubmit = async () => {
    if (!user || !selectedCar) return
    try {
      const data = await handleCreateBooking(user.id, selectedCar.id)
      toast({ title: 'Booking Berhasil', description: `Kode: ${data.kode_booking}` })
      navigate('myBookings')
    } catch (e: unknown) {
      toast({ title: 'Booking Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }

  if (!selectedCar) return null

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-4">
      <button onClick={() => selectedCar ? navigate('carDetail') : navigate('home')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 py-2">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <h1 className="text-xl font-bold text-slate-900">Form Booking</h1>

      <Card className="p-4 border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getCarImage(selectedCar)} flex items-center justify-center flex-shrink-0`}>
            <Car className="w-8 h-8 text-white/60" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{selectedCar.nama_mobil}</h3>
            <p className="text-xs text-slate-500">{selectedCar.merk} • {selectedCar.transmisi} • {selectedCar.kapasitas} orang</p>
            <p className="text-sm font-bold text-slate-900">Rp {formatCurrency(selectedCar.harga_harian)}/hari</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4" /> Tanggal & Waktu</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Tanggal Mulai</Label>
            <Input type="date" value={bookingForm.tanggal_mulai} onChange={e => setBookingForm(prev => ({ ...prev, tanggal_mulai: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Jam Mulai</Label>
            <Input type="time" value={bookingForm.jam_mulai} onChange={e => setBookingForm(prev => ({ ...prev, jam_mulai: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Tanggal Selesai</Label>
            <Input type="date" value={bookingForm.tanggal_selesai} onChange={e => setBookingForm(prev => ({ ...prev, tanggal_selesai: e.target.value }))} min={bookingForm.tanggal_mulai || new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Jam Selesai</Label>
            <Input type="time" value={bookingForm.jam_selesai} onChange={e => setBookingForm(prev => ({ ...prev, jam_selesai: e.target.value }))} />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-900">Jenis Sewa</h3>
        <RadioGroup value={bookingForm.jenis_sewa} onValueChange={v => setBookingForm(prev => ({ ...prev, jenis_sewa: v }))}>
          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
            <RadioGroupItem value="lepas_kunci" id="lepas_kunci" />
            <Label htmlFor="lepas_kunci" className="flex-1 cursor-pointer">
              <span className="font-medium">Lepas Kunci</span>
              <span className="text-xs text-slate-500 block">Anda mengemudi sendiri</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50">
            <RadioGroupItem value="dengan_sopir" id="dengan_sopir" />
            <Label htmlFor="dengan_sopir" className="flex-1 cursor-pointer">
              <span className="font-medium">Dengan Sopir</span>
              <span className="text-xs text-slate-500 block">Sopir profesional (+Rp {formatCurrency(selectedCar.harga_sopir)}/hari)</span>
            </Label>
          </div>
        </RadioGroup>
      </Card>

      <Card className="p-4 border-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><User className="w-4 h-4" /> Data Penyewa</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Nama Lengkap</Label>
            <Input value={bookingForm.nama_penyewa} onChange={e => setBookingForm(prev => ({ ...prev, nama_penyewa: e.target.value }))} placeholder="Nama sesuai KTP" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">No. WhatsApp</Label>
            <Input value={bookingForm.no_wa} onChange={e => setBookingForm(prev => ({ ...prev, no_wa: e.target.value }))} placeholder="628xxxxxxxxxx" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Alamat</Label>
            <Textarea value={bookingForm.alamat} onChange={e => setBookingForm(prev => ({ ...prev, alamat: e.target.value }))} placeholder="Alamat lengkap" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">NIK (16 digit) {bookingForm.jenis_sewa === 'lepas_kunci' && <span className="text-red-500">*</span>}</Label>
              <Input value={bookingForm.nik} onChange={e => setBookingForm(prev => ({ ...prev, nik: e.target.value.replace(/\D/g, '').slice(0, 16) }))} placeholder="16 digit NIK" maxLength={16} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">No. SIM</Label>
              <Input value={bookingForm.no_sim} onChange={e => setBookingForm(prev => ({ ...prev, no_sim: e.target.value }))} placeholder="Nomor SIM" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Lokasi Jemput</Label>
            <Input value={bookingForm.lokasi_jemput} onChange={e => setBookingForm(prev => ({ ...prev, lokasi_jemput: e.target.value }))} placeholder="Alamat lokasi jemput (kosongkan jika ambil di kantor)" />
          </div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload Dokumen</h3>
        <p className="text-xs text-slate-500">Wajib upload KTP & SIM untuk sewa lepas kunci</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Foto KTP</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                try {
                  const url = await uploadFile(file)
                  setBookingForm(prev => ({ ...prev, ktp_url: url }))
                  toast({ title: 'KTP berhasil diupload' })
                } catch { toast({ title: 'Gagal upload KTP', variant: 'destructive' }) }
              }
            }} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Foto SIM</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                try {
                  const url = await uploadFile(file)
                  setBookingForm(prev => ({ ...prev, sim_url: url }))
                  toast({ title: 'SIM berhasil diupload' })
                } catch { toast({ title: 'Gagal upload SIM', variant: 'destructive' }) }
              }
            }} />
          </div>
        </div>
      </Card>

      {cost && (
        <Card className="p-4 border-slate-100 space-y-2 bg-slate-50">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Rincian Biaya</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Sewa ({cost.days} hari × Rp {formatCurrency(selectedCar.harga_harian)})</span><span>Rp {formatCurrency(cost.biaya_sewa)}</span></div>
            {cost.biaya_sopir > 0 && <div className="flex justify-between"><span className="text-slate-500">Sopir ({cost.days} hari × Rp {formatCurrency(selectedCar.harga_sopir)})</span><span>Rp {formatCurrency(cost.biaya_sopir)}</span></div>}
            {cost.biaya_antar > 0 && <div className="flex justify-between"><span className="text-slate-500">Antar Jemput</span><span>Rp {formatCurrency(cost.biaya_antar)}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Deposit</span><span>Rp {formatCurrency(cost.deposit)}</span></div>
            <Separator />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-slate-900">Rp {formatCurrency(cost.total)}</span></div>
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <Button className="flex-1 h-12 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20 font-semibold" disabled={loading || !bookingForm.tanggal_mulai || !bookingForm.tanggal_selesai || !bookingForm.nama_penyewa || !bookingForm.no_wa || !bookingForm.alamat || (bookingForm.jenis_sewa === 'lepas_kunci' && !bookingForm.nik)} onClick={handleBookingSubmit}>
          {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
          Buat Booking
        </Button>
        <Button variant="outline" className="h-12" onClick={() => {
          const msg = `Halo, saya ingin booking ${selectedCar.nama_mobil}\nTanggal: ${bookingForm.tanggal_mulai} - ${bookingForm.tanggal_selesai}\nJenis: ${bookingForm.jenis_sewa === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}`
          openWhatsApp(settings?.no_wa_admin || '6281234567890', msg)
        }}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
