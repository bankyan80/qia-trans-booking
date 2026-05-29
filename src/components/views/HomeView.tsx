'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car, ChevronRight, FileText, Users, Shield, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'
import { formatCurrency, getStatusColor, getCarImage } from '@/lib/helpers'

interface HomeViewProps {
  navigate: (view: string) => void
}

export function HomeView({ navigate }: HomeViewProps) {
  const { toast } = useToast()
  const cars = useStore(s => s.cars)
  const user = useStore(s => s.user)
  const bookingForm = useStore(s => s.bookingForm)
  const setSelectedCar = useStore(s => s.setSelectedCar)
  const setBookingForm = useStore(s => s.setBookingForm)
  const setFilterStatus = useStore(s => s.setFilterStatus)
  const fetchCars = useStore(s => s.fetchCars)
  const handleSeed = useStore(s => s.handleSeed)

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden shadow-lg shadow-blue-500/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-6 md:py-16">
          <div className="flex flex-row items-center gap-4 md:gap-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                Sewa Mobil<br />
                <span className="text-amber-300">Mudah, Cepat,</span><br />
                dan Aman
              </h2>
              <div className="flex gap-3 mt-4 md:mt-6">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 font-semibold h-9 md:h-12 px-4 md:px-6 text-xs md:text-sm shadow-lg shadow-blue-500/20" onClick={() => {
                  const el = document.getElementById('cars-section')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}>
                  <Car className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" /> Booking
                </Button>
              </div>
            </div>
            <div className="shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-2xl md:rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Car className="w-12 h-12 sm:w-16 sm:h-16 md:w-22 md:h-22 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Circular Icons Grid */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Car, label: 'Armada Lengkap', color: 'text-blue-800', bg: 'bg-gradient-to-br from-blue-50 to-blue-100', ring: 'ring-blue-300' },
            { icon: Shield, label: 'Harga Terjangkau', color: 'text-emerald-700', bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100', ring: 'ring-emerald-300' },
            { icon: Users, label: 'Pelayanan Profesional', color: 'text-purple-700', bg: 'bg-gradient-to-br from-purple-50 to-purple-100', ring: 'ring-purple-300' },
            { icon: CheckCircle, label: 'Aman & Terpercaya', color: 'text-amber-700', bg: 'bg-gradient-to-br from-amber-50 to-amber-100', ring: 'ring-amber-300' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${f.bg} ring-2 ${f.ring} flex items-center justify-center shadow-md`}>
                <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color}`} />
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-slate-700 text-center leading-tight">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cars Section */}
      <div id="cars-section" className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Mobil Tersedia</h2>
          <button
            className="text-sm font-medium text-blue-800 hover:text-blue-900 flex items-center gap-1"
            onClick={() => {
              setFilterStatus('all')
              fetchCars()
              document.getElementById('cars-section')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {cars.map(car => (
            <Card key={car.id} className="overflow-hidden hover:shadow-md transition-all duration-200 border border-slate-100 rounded-xl">
              <div className="flex flex-row h-[120px] sm:h-[130px]">
                {/* Car Photo - Left Side */}
                <div className={`w-[38%] shrink-0 bg-gradient-to-br ${getCarImage(car)} relative overflow-hidden`}>
                  {car.foto_url && !car.foto_url.includes('logo.png') ? (
                    <img src={car.foto_url} alt={car.nama_mobil} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-1">
                      <Car className="w-10 h-10 text-white/40" />
                      <span className="text-white/70 font-semibold text-[10px]">{car.merk}</span>
                    </div>
                  )}
                  <Badge className={`absolute top-1.5 left-1.5 ${getStatusColor(car.status)} text-[9px] font-medium px-1.5 py-0.5`}>
                    {car.status}
                  </Badge>
                </div>
                {/* Car Details - Right Side */}
                <div className="flex-1 p-2.5 sm:p-3 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm sm:text-[15px] leading-tight line-clamp-1">{car.nama_mobil}</h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 mt-1">
                      <span>{car.tahun}</span>
                      <span>•</span>
                      <span>{car.transmisi}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" />{car.kapasitas} Kursi</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-blue-900 text-sm sm:text-[15px] leading-none">Rp {formatCurrency(car.harga_harian)} <span className="text-[10px] font-normal text-slate-400">/hari</span></p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" className="h-7 text-[10px] sm:text-[11px] px-3 rounded-md bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-sm shadow-blue-500/20" disabled={car.status !== 'Tersedia'} onClick={() => {
                      if (!user) { navigate('login'); return }
                      setSelectedCar(car)
                      setBookingForm(prev => ({ ...prev, nama_penyewa: user.nama, no_wa: user.no_wa }))
                      navigate('bookingForm')
                    }}>
                      Booking
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] sm:text-[11px] px-3 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => { setSelectedCar(car); navigate('carDetail') }}>
                      Detail
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Belum ada mobil tersedia</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={async () => {
              try {
                const data = await (handleSeed as unknown as () => Promise<{ data: { users: number; cars: number; booking: number } }>)()
                toast({ title: 'Database Di-seed!', description: `${data.data.users} user, ${data.data.cars} mobil, ${data.data.booking} booking` })
                useStore.getState().fetchCars()
                useStore.getState().fetchSettings()
                if (useStore.getState().user?.role === 'admin') {
                  useStore.getState().fetchAllBookings()
                  useStore.getState().fetchDashboard()
                }
              } catch (e: unknown) {
                toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
              }
            }}>Seed Data Demo</Button>
          </div>
        )}
      </div>

      {/* Syarat & Ketentuan Link */}
      <div className="max-w-5xl mx-auto px-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-700" />
              <div>
                <p className="text-sm font-medium text-slate-900">Syarat & Ketentuan</p>
                <p className="text-xs text-slate-500">Ketentuan sewa mobil Qia Trans</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('terms')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
