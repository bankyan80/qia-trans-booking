'use client'

import React, { useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

interface AdminCarsViewProps {
  navigate: (view: string) => void
}

export function AdminCarsView({ navigate }: AdminCarsViewProps) {
  const { toast } = useToast()
  const user = useStore(s => s.user)
  const cars = useStore(s => s.cars)
  const fetchCars = useStore(s => s.fetchCars)
  const setSelectedCarForEdit = useStore(s => s.setSelectedCarForEdit)
  const setCarForm = useStore(s => s.setCarForm)
  const handleDeleteCar = useStore(s => s.handleDeleteCar)

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const handleDelete = useCallback(async (carId: string) => {
    if (!confirm('Yakin ingin menghapus mobil ini?')) return
    try {
      await handleDeleteCar(carId)
      toast({ title: 'Mobil Dihapus' })
      fetchCars()
    } catch (e: unknown) {
      toast({ title: 'Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
    }
  }, [handleDeleteCar, fetchCars, toast])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 lg:ml-64 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Kelola Mobil</h1>
        <Button className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20" onClick={() => {
          setSelectedCarForEdit(null)
          setCarForm({ nama_mobil: '', merk: '', tipe: '', tahun: 2024, transmisi: 'Automatic', kapasitas: 5, nomor_polisi: '', warna: '', harga_harian: 0, harga_sopir: 0, deposit: 0, biaya_antar_jemput: 0, status: 'Tersedia', foto_url: '', deskripsi: '' })
          navigate('adminCarForm')
        }}>
          <Plus className="w-4 h-4 mr-1" /> Tambah Mobil
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {cars.map(car => (
          <Card key={car.id} className="overflow-hidden hover:shadow-md transition-all duration-200 border border-slate-100 rounded-xl">
            <div className="flex flex-row h-[110px] sm:h-[120px]">
              <div className={`w-[35%] shrink-0 bg-gradient-to-br ${getCarImage(car)} relative overflow-hidden`}>
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
              <div className="flex-1 p-2.5 sm:p-3 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-bold text-blue-900 text-sm sm:text-[15px] leading-tight line-clamp-1">{car.nama_mobil}</h3>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 mt-1">
                    <span>{car.nomor_polisi}</span>
                    <span>•</span>
                    <span>{car.transmisi}</span>
                    <span>•</span>
                    <span>{car.kapasitas} org</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-blue-900 text-sm sm:text-[15px] leading-none">Rp {formatCurrency(car.harga_harian)} <span className="text-[10px] font-normal text-slate-400">/hari</span></p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 text-[10px] sm:text-[11px] px-3 rounded-md border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => { setSelectedCarForEdit(car); setCarForm({ nama_mobil: car.nama_mobil, merk: car.merk, tipe: car.tipe, tahun: car.tahun, transmisi: car.transmisi, kapasitas: car.kapasitas, nomor_polisi: car.nomor_polisi, warna: car.warna, harga_harian: car.harga_harian, harga_sopir: car.harga_sopir, deposit: car.deposit, biaya_antar_jemput: car.biaya_antar_jemput, status: car.status, foto_url: car.foto_url, deskripsi: car.deskripsi }); navigate('adminCarForm') }}>
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] sm:text-[11px] px-3 rounded-md border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(car.id)}>
                    <Trash2 className="w-3 h-3 mr-1" /> Hapus
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
