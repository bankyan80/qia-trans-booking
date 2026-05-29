'use client'

import React, { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, CheckCircle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate, formatDateLong, getStatusColor, getCarImage, apiFetch } from '@/lib/helpers'

interface AdminHandoverViewProps {
  navigate: (view: string) => void
}

export function AdminHandoverView({ navigate }: AdminHandoverViewProps) {
  const { toast } = useToast()
  const selectedBooking = useStore(s => s.selectedBooking)
  const handoverForm = useStore(s => s.handoverForm)
  const setHandoverForm = useStore(s => s.setHandoverForm)
  const loading = useStore(s => s.loading)
  const handleCreateHandover = useStore(s => s.handleCreateHandover)
  const handleUpdateBookingStatus = useStore(s => s.handleUpdateBookingStatus)
  const fetchAllBookings = useStore(s => s.fetchAllBookings)
  const fetchDashboard = useStore(s => s.fetchDashboard)
  const uploadFile = useStore(s => s.uploadFile)

  const handleSave = useCallback(async () => {
    if (!selectedBooking) return
    try {
      await handleCreateHandover(selectedBooking.id, handoverForm)
      await handleUpdateBookingStatus(selectedBooking.id, 'Selesai')
      toast({ title: 'Serah Terima Dicatat' })
      fetchAllBookings()
      fetchDashboard()
      navigate('adminBookings')
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }, [selectedBooking, handoverForm, handleCreateHandover, handleUpdateBookingStatus, fetchAllBookings, fetchDashboard, navigate, toast])

  if (!selectedBooking) return null

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 lg:ml-64 space-y-4">
      <button onClick={() => navigate('adminBookingDetail')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 py-2">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>
      <h1 className="text-xl font-bold text-slate-900">Serah Terima Mobil</h1>
      <p className="text-sm text-slate-500">Booking: {selectedBooking.kode_booking} - {selectedBooking.car?.nama_mobil}</p>

      <Card className="p-4 border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-900">Kondisi Awal (Serah)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label className="text-xs">KM Awal</Label><Input type="number" value={handoverForm.km_awal || ''} onChange={e => setHandoverForm(prev => ({ ...prev, km_awal: Number(e.target.value) }))} /></div>
          <div className="space-y-1">
            <Label className="text-xs">BBM Awal</Label>
            <Select value={handoverForm.bbm_awal} onValueChange={v => setHandoverForm(prev => ({ ...prev, bbm_awal: v }))}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="E">E</SelectItem><SelectItem value="1/4">1/4</SelectItem>
                <SelectItem value="1/2">1/2</SelectItem><SelectItem value="3/4">3/4</SelectItem><SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1"><Label className="text-xs">Catatan Awal</Label><Textarea value={handoverForm.catatan_awal} onChange={e => setHandoverForm(prev => ({ ...prev, catatan_awal: e.target.value }))} rows={2} /></div>
        <div className="space-y-1"><Label className="text-xs">Foto Kondisi Awal</Label><Input type="file" accept="image/*" onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) { try { const url = await uploadFile(file); setHandoverForm(prev => ({ ...prev, foto_awal_url: url })); toast({ title: 'Foto awal berhasil diupload' }) } catch { toast({ title: 'Gagal upload', variant: 'destructive' }) } }
        }} />{handoverForm.foto_awal_url && <p className="text-xs text-green-600">✓ Foto sudah diupload</p>}</div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-900">Kondisi Akhir (Terima)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label className="text-xs">KM Akhir</Label><Input type="number" value={handoverForm.km_akhir || ''} onChange={e => setHandoverForm(prev => ({ ...prev, km_akhir: Number(e.target.value) }))} /></div>
          <div className="space-y-1">
            <Label className="text-xs">BBM Akhir</Label>
            <Select value={handoverForm.bbm_akhir} onValueChange={v => setHandoverForm(prev => ({ ...prev, bbm_akhir: v }))}>
              <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="E">E</SelectItem><SelectItem value="1/4">1/4</SelectItem>
                <SelectItem value="1/2">1/2</SelectItem><SelectItem value="3/4">3/4</SelectItem><SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1"><Label className="text-xs">Catatan Akhir / Kerusakan</Label><Textarea value={handoverForm.catatan_akhir} onChange={e => setHandoverForm(prev => ({ ...prev, catatan_akhir: e.target.value }))} rows={2} /></div>
        <div className="space-y-1"><Label className="text-xs">Foto Kondisi Akhir</Label><Input type="file" accept="image/*" onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) { try { const url = await uploadFile(file); setHandoverForm(prev => ({ ...prev, foto_akhir_url: url })); toast({ title: 'Foto akhir berhasil diupload' }) } catch { toast({ title: 'Gagal upload', variant: 'destructive' }) } }
        }} />{handoverForm.foto_akhir_url && <p className="text-xs text-green-600">✓ Foto sudah diupload</p>}</div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-900">Denda & Deposit</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label className="text-xs">Denda</Label><Input type="number" value={handoverForm.denda || ''} onChange={e => setHandoverForm(prev => ({ ...prev, denda: Number(e.target.value) }))} /></div>
          <div className="space-y-1">
            <Label className="text-xs">Status Deposit</Label>
            <Select value={handoverForm.status_deposit} onValueChange={v => setHandoverForm(prev => ({ ...prev, status_deposit: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Belum Dikembalikan">Belum Dikembalikan</SelectItem>
                <SelectItem value="Dikembalikan">Dikembalikan</SelectItem>
                <SelectItem value="Dipotong">Dipotong</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1"><Label className="text-xs">Keterangan Denda</Label><Input value={handoverForm.denda_keterangan} onChange={e => setHandoverForm(prev => ({ ...prev, denda_keterangan: e.target.value }))} /></div>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 h-12 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20 font-semibold" disabled={loading} onClick={handleSave}>
          {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
          Simpan & Selesaikan
        </Button>
      </div>
    </div>
  )
}
