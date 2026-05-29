'use client'

import React, { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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

interface AdminBookingsViewProps {
  navigate: (view: string) => void
}

export function AdminBookingsView({ navigate }: AdminBookingsViewProps) {
  const { toast } = useToast()
  const user = useStore(s => s.user)
  const allBookings = useStore(s => s.allBookings)
  const filterStatus = useStore(s => s.filterStatus)
  const setFilterStatus = useStore(s => s.setFilterStatus)
  const calendarMonth = useStore(s => s.calendarMonth)
  const setCalendarMonth = useStore(s => s.setCalendarMonth)
  const fetchAllBookings = useStore(s => s.fetchAllBookings)
  const fetchDashboard = useStore(s => s.fetchDashboard)
  const setSelectedBooking = useStore(s => s.setSelectedBooking)
  const handleUpdateBookingStatus = useStore(s => s.handleUpdateBookingStatus)
  const handleUpdatePaymentStatus = useStore(s => s.handleUpdatePaymentStatus)

  useEffect(() => {
    fetchAllBookings()
    fetchDashboard()
  }, [fetchAllBookings, fetchDashboard])

  const handleStatusUpdate = useCallback(async (bookingId: string, status_booking: string, label?: string) => {
    try {
      await handleUpdateBookingStatus(bookingId, status_booking)
      toast({ title: 'Status Diperbarui', description: `Booking ${label || status_booking}` })
      fetchAllBookings()
      fetchDashboard()
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }, [handleUpdateBookingStatus, fetchAllBookings, fetchDashboard, toast])

  if (!user || user.role !== 'admin') return null

  const filteredBookings = filterStatus === 'all' ? allBookings : allBookings.filter(b => b.status_booking === filterStatus)

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 lg:ml-64 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-slate-900">Kelola Booking</h1>
        <div className="flex gap-2 items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44 h-9 text-xs"><SelectValue placeholder="Filter Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Menunggu Konfirmasi">Menunggu Konfirmasi</SelectItem>
              <SelectItem value="Dikonfirmasi">Dikonfirmasi</SelectItem>
              <SelectItem value="Menunggu Pembayaran">Menunggu Pembayaran</SelectItem>
              <SelectItem value="DP Diterima">DP Diterima</SelectItem>
              <SelectItem value="Lunas">Lunas</SelectItem>
              <SelectItem value="Sedang Disewa">Sedang Disewa</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
              <SelectItem value="Ditolak">Ditolak</SelectItem>
              <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
              <SelectItem value="Bermasalah">Bermasalah</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => { fetchAllBookings(); fetchDashboard() }}><RefreshCw className="w-3 h-3" /></Button>
        </div>
      </div>

      <Card className="border-slate-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={() => {
            const d = new Date(calendarMonth)
            d.setMonth(d.getMonth() - 1)
            setCalendarMonth(d)
          }}><ChevronLeft className="w-4 h-4" /></Button>
          <h3 className="font-semibold text-slate-900">{calendarMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
          <Button variant="ghost" size="sm" onClick={() => {
            const d = new Date(calendarMonth)
            d.setMonth(d.getMonth() + 1)
            setCalendarMonth(d)
          }}><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
            <div key={d} className="p-1 text-slate-400 font-medium">{d}</div>
          ))}
            {(() => {
              const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()
              const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
              const cells: React.ReactNode[] = []
            for (let i = 0; i < firstDay; i++) cells.push(<div key={`empty-${i}`} />)
            for (let day = 1; day <= daysInMonth; day++) {
              const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const hasBooking = allBookings.some(b =>
                dateStr >= b.tanggal_mulai && dateStr <= b.tanggal_selesai &&
                !['Ditolak', 'Dibatalkan'].includes(b.status_booking)
              )
              const isToday = dateStr === new Date().toISOString().split('T')[0]
              cells.push(
                <div key={day} className={`p-1.5 rounded-lg text-xs ${hasBooking ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600'} ${isToday ? 'ring-2 ring-slate-900' : ''}`}>
                  {day}
                </div>
              )
            }
            return cells
          })()}
        </div>
      </Card>

      <div className="space-y-3">
        {filteredBookings.map(booking => (
          <Card key={booking.id} className="p-4 border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-slate-900">{booking.kode_booking}</span>
                  <Badge className={`${getStatusColor(booking.status_booking)} text-xs`}>{booking.status_booking}</Badge>
                </div>
                <p className="text-sm text-slate-700">{booking.nama_penyewa} • {booking.car?.nama_mobil}</p>
                <p className="text-xs text-slate-500">{formatDate(booking.tanggal_mulai)} - {formatDate(booking.tanggal_selesai)} • {booking.durasi_hari} hari • {booking.jenis_sewa === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir'}</p>
              </div>
              <span className="font-bold text-sm text-slate-900 whitespace-nowrap ml-2">Rp {formatCurrency(booking.total_biaya)}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setSelectedBooking(booking); navigate('adminBookingDetail') }}>
                <Eye className="w-3 h-3 mr-1" /> Detail
              </Button>
              {booking.status_booking === 'Menunggu Konfirmasi' && (
                <>
                  <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusUpdate(booking.id, 'Dikonfirmasi', 'Dikonfirmasi')}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Terima
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(booking.id, 'Ditolak', 'Ditolak')}>
                    <XCircle className="w-3 h-3 mr-1" /> Tolak
                  </Button>
                </>
              )}
              {booking.status_booking === 'Dikonfirmasi' && booking.status_pembayaran === 'Lunas' && (
                <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => handleStatusUpdate(booking.id, 'Sedang Disewa', 'Sedang Disewa')}>
                  Mulai Sewa
                </Button>
              )}
              {booking.status_booking === 'Sedang Disewa' && (
                <Button size="sm" className="h-8 text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => { setSelectedBooking(booking); navigate('adminHandover') }}>
                  Serah Terima
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Tidak ada booking</p>
        </div>
      )}
    </div>
  )
}
