'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface AdminReportsViewProps {
  navigate: (view: string) => void
}

export function AdminReportsView({ navigate }: AdminReportsViewProps) {
  const user = useStore(s => s.user)
  const allBookings = useStore(s => s.allBookings)
  const fetchAllBookings = useStore(s => s.fetchAllBookings)
  const setSelectedBooking = useStore(s => s.setSelectedBooking)

  useEffect(() => {
    fetchAllBookings()
  }, [fetchAllBookings])

  if (!user || user.role !== 'admin') return null

  const completedBookings = allBookings.filter(b => b.status_booking === 'Selesai' || b.status_booking === 'Sedang Disewa')
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.total_biaya, 0)
  const totalBookings = allBookings.length
  const activeBookings = allBookings.filter(b => ['Dikonfirmasi', 'Sedang Disewa', 'Menunggu Pembayaran'].includes(b.status_booking)).length

  const monthlyData: Record<string, { count: number; revenue: number }> = {}
  completedBookings.forEach(b => {
    const month = b.tanggal_mulai.substring(0, 7)
    if (!monthlyData[month]) monthlyData[month] = { count: 0, revenue: 0 }
    monthlyData[month].count++
    monthlyData[month].revenue += b.total_biaya
  })

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 lg:ml-64 space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Laporan</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 border-slate-100"><p className="text-xs text-slate-500">Total Booking</p><p className="text-2xl font-bold text-slate-900">{totalBookings}</p></Card>
        <Card className="p-4 border-slate-100"><p className="text-xs text-slate-500">Booking Aktif</p><p className="text-2xl font-bold text-blue-800">{activeBookings}</p></Card>
        <Card className="p-4 border-slate-100"><p className="text-xs text-slate-500">Selesai</p><p className="text-2xl font-bold text-green-700">{completedBookings.length}</p></Card>
        <Card className="p-4 border-slate-100"><p className="text-xs text-slate-500">Total Pendapatan</p><p className="text-lg font-bold text-slate-900">Rp {formatCurrency(totalRevenue)}</p></Card>
      </div>

      <Card className="border-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Pendapatan per Bulan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(monthlyData).sort().reverse().map(([month, data]) => (
              <div key={month} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{new Date(month + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-slate-500">{data.count} booking</p>
                </div>
                <span className="font-bold text-slate-900">Rp {formatCurrency(data.revenue)}</span>
              </div>
            ))}
            {Object.keys(monthlyData).length === 0 && <p className="text-center text-slate-400 py-4">Belum ada data</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Ringkasan Status Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(() => {
              const counts: Record<string, number> = {}
              allBookings.forEach(b => { counts[b.status_booking] = (counts[b.status_booking] || 0) + 1 })
              return Object.entries(counts).map(([status, count]) => (
                <div key={status} className="p-3 bg-slate-50 rounded-lg">
                  <Badge className={`${getStatusColor(status)} text-xs mb-1`}>{status}</Badge>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                </div>
              ))
            })()}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cetak Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allBookings.filter(b => b.status_booking !== 'Dibatalkan' && b.status_booking !== 'Ditolak').map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">{booking.kode_booking}</p>
                  <p className="text-xs text-slate-500">{booking.nama_penyewa} - {booking.car?.nama_mobil}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => { setSelectedBooking(booking); navigate('invoice') }}>
                  <FileText className="w-3 h-3 mr-1" /> Invoice
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
