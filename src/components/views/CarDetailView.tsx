'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Gauge, Users, Car, Fuel, Calendar, MessageCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'
import { formatCurrency, getStatusColor, getCarImage } from '@/lib/helpers'

interface CarDetailViewProps {
  navigate: (view: string) => void
}

export function CarDetailView({ navigate }: CarDetailViewProps) {
  const { toast } = useToast()
  const selectedCar = useStore(s => s.selectedCar)
  const user = useStore(s => s.user)
  const settings = useStore(s => s.settings)
  const setBookingForm = useStore(s => s.setBookingForm)
  const openWhatsApp = useStore(s => s.openWhatsApp)

  if (!selectedCar) return null
  const car = selectedCar

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-4">
      <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors py-2">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <div className={`h-56 md:h-72 bg-gradient-to-br ${getCarImage(car)} rounded-2xl relative overflow-hidden`}>
        {car.foto_url && !car.foto_url.includes('logo.png') ? (
          <img src={car.foto_url} alt={car.nama_mobil} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Car className="w-24 h-24 text-white/30" />
          </div>
        )}
        <Badge className={`absolute top-4 right-4 ${getStatusColor(car.status)}`}>
          {car.status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{car.nama_mobil}</h1>
          <p className="text-slate-500">{car.merk} • {car.tipe} • {car.tahun}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Gauge, label: 'Transmisi', value: car.transmisi },
            { icon: Users, label: 'Kapasitas', value: `${car.kapasitas} orang` },
            { icon: Car, label: 'Nomor Polisi', value: car.nomor_polisi },
            { icon: Fuel, label: 'Warna', value: car.warna || '-' },
          ].map((spec, i) => (
            <Card key={i} className="p-3 border-slate-100">
              <spec.icon className="w-4 h-4 text-slate-400 mb-1" />
              <p className="text-[10px] text-slate-500">{spec.label}</p>
              <p className="text-sm font-semibold text-slate-900">{spec.value}</p>
            </Card>
          ))}
        </div>

        {car.deskripsi && (
          <Card className="p-4 border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Deskripsi</h3>
            <p className="text-sm text-slate-600">{car.deskripsi}</p>
          </Card>
        )}

        <Card className="p-4 border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-3">Rincian Harga</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Harga Harian</span><span className="font-medium">Rp {formatCurrency(car.harga_harian)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Sopir / Hari</span><span className="font-medium">Rp {formatCurrency(car.harga_sopir)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Deposit</span><span className="font-medium">Rp {formatCurrency(car.deposit)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Biaya Antar Jemput</span><span className="font-medium">Rp {formatCurrency(car.biaya_antar_jemput)}</span></div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button className="flex-1 h-12 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20 font-semibold" disabled={car.status !== 'Tersedia'} onClick={() => {
            if (!user) { navigate('login'); return }
            setBookingForm(prev => ({ ...prev, nama_penyewa: user.nama, no_wa: user.no_wa }))
            navigate('bookingForm')
          }}>
            <Calendar className="w-4 h-4 mr-2" /> Booking Sekarang
          </Button>
          <Button variant="outline" className="h-12" onClick={() => openWhatsApp(settings?.no_wa_admin || '6281234567890', `Halo, saya tertarik dengan ${car.nama_mobil}. Apakah tersedia?`)}>
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
