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

interface AdminCarFormViewProps {
  navigate: (view: string) => void
}

export function AdminCarFormView({ navigate }: AdminCarFormViewProps) {
  const { toast } = useToast()
  const selectedCarForEdit = useStore(s => s.selectedCarForEdit)
  const carForm = useStore(s => s.carForm)
  const setCarForm = useStore(s => s.setCarForm)
  const loading = useStore(s => s.loading)
  const handleSaveCar = useStore(s => s.handleSaveCar)
  const fetchCars = useStore(s => s.fetchCars)
  const uploadFile = useStore(s => s.uploadFile)

  const isEdit = !!selectedCarForEdit

  const handleSave = useCallback(async () => {
    try {
      await handleSaveCar(isEdit, selectedCarForEdit?.id)
      toast({ title: isEdit ? 'Mobil Diperbarui' : 'Mobil Ditambahkan' })
      fetchCars()
      navigate('adminCars')
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }, [handleSaveCar, isEdit, selectedCarForEdit, fetchCars, navigate, toast])

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 lg:ml-64 space-y-4">
      <button onClick={() => navigate('adminCars')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 py-2">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>
      <h1 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Mobil' : 'Tambah Mobil'}</h1>

      <Card className="p-4 border-slate-100 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label className="text-xs">Nama Mobil</Label><Input value={carForm.nama_mobil} onChange={e => setCarForm(prev => ({ ...prev, nama_mobil: e.target.value }))} placeholder="Toyota Avanza" /></div>
          <div className="space-y-1"><Label className="text-xs">Merk</Label><Input value={carForm.merk} onChange={e => setCarForm(prev => ({ ...prev, merk: e.target.value }))} placeholder="Toyota" /></div>
          <div className="space-y-1"><Label className="text-xs">Tipe</Label><Input value={carForm.tipe} onChange={e => setCarForm(prev => ({ ...prev, tipe: e.target.value }))} placeholder="MPV" /></div>
          <div className="space-y-1"><Label className="text-xs">Tahun</Label><Input type="number" value={carForm.tahun} onChange={e => setCarForm(prev => ({ ...prev, tahun: Number(e.target.value) }))} /></div>
          <div className="space-y-1">
            <Label className="text-xs">Transmisi</Label>
            <Select value={carForm.transmisi} onValueChange={v => setCarForm(prev => ({ ...prev, transmisi: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Automatic">Automatic</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label className="text-xs">Kapasitas</Label><Input type="number" value={carForm.kapasitas} onChange={e => setCarForm(prev => ({ ...prev, kapasitas: Number(e.target.value) }))} /></div>
          <div className="space-y-1"><Label className="text-xs">Nomor Polisi</Label><Input value={carForm.nomor_polisi} onChange={e => setCarForm(prev => ({ ...prev, nomor_polisi: e.target.value }))} placeholder="B 1234 ABC" /></div>
          <div className="space-y-1"><Label className="text-xs">Warna</Label><Input value={carForm.warna} onChange={e => setCarForm(prev => ({ ...prev, warna: e.target.value }))} placeholder="Putih" /></div>
          <div className="space-y-1"><Label className="text-xs">Harga Harian</Label><Input type="number" value={carForm.harga_harian || ''} onChange={e => setCarForm(prev => ({ ...prev, harga_harian: Number(e.target.value) }))} /></div>
          <div className="space-y-1"><Label className="text-xs">Harga Sopir/Hari</Label><Input type="number" value={carForm.harga_sopir || ''} onChange={e => setCarForm(prev => ({ ...prev, harga_sopir: Number(e.target.value) }))} /></div>
          <div className="space-y-1"><Label className="text-xs">Deposit</Label><Input type="number" value={carForm.deposit || ''} onChange={e => setCarForm(prev => ({ ...prev, deposit: Number(e.target.value) }))} /></div>
          <div className="space-y-1"><Label className="text-xs">Biaya Antar Jemput</Label><Input type="number" value={carForm.biaya_antar_jemput || ''} onChange={e => setCarForm(prev => ({ ...prev, biaya_antar_jemput: Number(e.target.value) }))} /></div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Status</Label>
          <Select value={carForm.status} onValueChange={v => setCarForm(prev => ({ ...prev, status: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Tersedia">Tersedia</SelectItem><SelectItem value="Disewa">Disewa</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Foto Mobil</Label>
          <Input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files?.[0]
            if (file) {
              try {
                const url = await uploadFile(file)
                setCarForm(prev => ({ ...prev, foto_url: url }))
                toast({ title: 'Foto berhasil diupload' })
              } catch { toast({ title: 'Gagal upload', variant: 'destructive' }) }
            }
          }} />
          {carForm.foto_url && <img src={carForm.foto_url} alt="Preview" className="w-32 h-20 object-cover rounded-lg mt-1" />}
        </div>
        <div className="space-y-1"><Label className="text-xs">Deskripsi</Label><Textarea value={carForm.deskripsi} onChange={e => setCarForm(prev => ({ ...prev, deskripsi: e.target.value }))} rows={3} /></div>
        <Button className="w-full h-12 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20 font-semibold" disabled={loading} onClick={handleSave}>
          {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
          {isEdit ? 'Simpan Perubahan' : 'Tambah Mobil'}
        </Button>
      </Card>
    </div>
  )
}
