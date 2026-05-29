'use client'

import React, { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

interface AdminSettingsViewProps {
  navigate: (view: string) => void
}

export function AdminSettingsView({ navigate }: AdminSettingsViewProps) {
  const { toast } = useToast()
  const user = useStore(s => s.user)
  const settingsForm = useStore(s => s.settingsForm)
  const setSettingsForm = useStore(s => s.setSettingsForm)
  const loading = useStore(s => s.loading)
  const fetchSettings = useStore(s => s.fetchSettings)
  const handleSaveSettings = useStore(s => s.handleSaveSettings)
  const uploadFile = useStore(s => s.uploadFile)

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = useCallback(async () => {
    try {
      await handleSaveSettings(settingsForm)
      toast({ title: 'Pengaturan Disimpan' })
      fetchSettings()
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }, [handleSaveSettings, settingsForm, fetchSettings, toast])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 lg:ml-64 space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Pengaturan Aplikasi</h1>

      <Card className="p-4 border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-900">Informasi Perusahaan</h3>
        <div className="space-y-3">
          <div className="space-y-1"><Label className="text-xs">Nama Perusahaan</Label><Input value={settingsForm.nama_perusahaan} onChange={e => setSettingsForm(prev => ({ ...prev, nama_perusahaan: e.target.value }))} /></div>
          <div className="space-y-1"><Label className="text-xs">Nama Aplikasi</Label><Input value={settingsForm.nama_aplikasi} onChange={e => setSettingsForm(prev => ({ ...prev, nama_aplikasi: e.target.value }))} /></div>
          <div className="space-y-1"><Label className="text-xs">No. WhatsApp Admin</Label><Input value={settingsForm.no_wa_admin} onChange={e => setSettingsForm(prev => ({ ...prev, no_wa_admin: e.target.value }))} placeholder="628xxxxxxxxxx" /></div>
          <div className="space-y-1"><Label className="text-xs">Alamat Perusahaan</Label><Textarea value={settingsForm.alamat_perusahaan} onChange={e => setSettingsForm(prev => ({ ...prev, alamat_perusahaan: e.target.value }))} rows={2} /></div>
          <div className="space-y-1"><Label className="text-xs">Rekening Bank</Label><Input value={settingsForm.rekening_bank} onChange={e => setSettingsForm(prev => ({ ...prev, rekening_bank: e.target.value }))} placeholder="BCA - 1234567890 a.n. Nama" /></div>
        </div>
      </Card>

      <Card className="p-4 border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-900">Tampilan</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Logo</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                try {
                  const url = await uploadFile(file)
                  setSettingsForm(prev => ({ ...prev, logo_url: url }))
                  toast({ title: 'Logo berhasil diupload' })
                } catch { toast({ title: 'Gagal upload', variant: 'destructive' }) }
              }
            }} />
            {settingsForm.logo_url && <img src={settingsForm.logo_url} alt="Logo" className="w-20 h-20 object-contain mt-1" />}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">QRIS</Label>
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) {
                try {
                  const url = await uploadFile(file)
                  setSettingsForm(prev => ({ ...prev, qris_url: url }))
                  toast({ title: 'QRIS berhasil diupload' })
                } catch { toast({ title: 'Gagal upload', variant: 'destructive' }) }
              }
            }} />
            {settingsForm.qris_url && <img src={settingsForm.qris_url} alt="QRIS" className="w-32 h-32 object-contain mt-1" />}
          </div>
        </div>
      </Card>

      <Button className="w-full h-12 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20 font-semibold" disabled={loading} onClick={handleSave}>
        {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
        Simpan Pengaturan
      </Button>

      <Card className="p-4 border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-3">Admin</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-800 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{user.nama}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
