'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
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

interface AdminDashboardViewProps {
  navigate: (view: string) => void
}

export function AdminDashboardView({ navigate }: AdminDashboardViewProps) {
  const { toast } = useToast()
  const user = useStore(s => s.user)
  const dashboard = useStore(s => s.dashboard)
  const fetchDashboard = useStore(s => s.fetchDashboard)
  const setSelectedBooking = useStore(s => s.setSelectedBooking)

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 lg:ml-64 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Selamat datang, Admin Qia Trans! 👋</p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: 'Total Mobil', value: dashboard?.totalCars || 0, icon: Car, color: 'bg-slate-100 text-slate-700' },
          { label: 'Tersedia', value: dashboard?.availableCars || 0, icon: CheckCircle, color: 'bg-green-100 text-green-700' },
          { label: 'Disewa', value: dashboard?.rentedCars || 0, icon: Clock, color: 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-800' },
          { label: 'Maintenance', value: dashboard?.maintenanceCars || 0, icon: Wrench, color: 'bg-amber-100 text-amber-700' },
          { label: 'Booking Hari Ini', value: dashboard?.todayBookings || 0, icon: CalendarDays, color: 'bg-purple-100 text-purple-700' },
          { label: 'Pendapatan', value: `Rp ${formatCurrency(dashboard?.monthlyRevenue || 0)}`, icon: CreditCard, color: 'bg-emerald-100 text-emerald-700', isText: true },
        ].map((stat, i) => (
          <Card key={i} className="p-2 sm:p-3 border-slate-100">
            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg ${stat.color} flex items-center justify-center mb-1.5`}>
              <stat.icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-500 leading-tight truncate">{stat.label}</p>
            <p className={`font-bold ${stat.isText ? 'text-[10px] sm:text-xs' : 'text-sm sm:text-xl'} text-slate-900 leading-tight`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="border-slate-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Booking Terbaru</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('adminBookings')}>Lihat Semua</Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {(dashboard?.recentBookings || []).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { setSelectedBooking(booking); navigate('adminBookingDetail') }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{booking.nama_penyewa} - {booking.car?.nama_mobil}</p>
                    <p className="text-xs text-slate-500">{booking.kode_booking} • {formatDate(booking.tanggal_mulai)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge className={`${getStatusColor(booking.status_booking)} text-xs`}>{booking.status_booking}</Badge>
                    <span className="text-sm font-medium text-slate-900 whitespace-nowrap">Rp {formatCurrency(booking.total_biaya)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
