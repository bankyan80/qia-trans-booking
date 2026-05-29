import type { CarType } from './types'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const formatDateLong = (dateStr: string): string => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    'Tersedia': 'bg-green-100 text-green-800 border-green-200',
    'Disewa': 'bg-blue-100 text-blue-800 border-blue-200',
    'Maintenance': 'bg-amber-100 text-amber-800 border-amber-200',
    'Menunggu Konfirmasi': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Dikonfirmasi': 'bg-blue-100 text-blue-800 border-blue-200',
    'Ditolak': 'bg-red-100 text-red-800 border-red-200',
    'Menunggu Pembayaran': 'bg-orange-100 text-orange-800 border-orange-200',
    'DP Diterima': 'bg-purple-100 text-purple-800 border-purple-200',
    'Lunas': 'bg-green-100 text-green-800 border-green-200',
    'Sedang Disewa': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Selesai': 'bg-gray-100 text-gray-700 border-gray-200',
    'Dibatalkan': 'bg-red-100 text-red-800 border-red-200',
    'Bermasalah': 'bg-red-200 text-red-900 border-red-300',
    'Belum Bayar': 'bg-gray-100 text-gray-600 border-gray-200',
    'Menunggu Verifikasi': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Belum Dikembalikan': 'bg-gray-100 text-gray-600 border-gray-200',
    'Dikembalikan': 'bg-green-100 text-green-800 border-green-200',
    'Dipotong': 'bg-red-100 text-red-800 border-red-200',
  }
  return map[status] || 'bg-gray-100 text-gray-700 border-gray-200'
}

export const getCarImage = (car: CarType): string => {
  if (car.foto_url && !car.foto_url.includes('logo.png')) return car.foto_url
  const colors: Record<string, string> = {
    'Toyota': 'from-blue-600 to-blue-800',
    'Honda': 'from-red-600 to-red-800',
    'Mitsubishi': 'from-slate-600 to-slate-800',
    'Suzuki': 'from-amber-600 to-amber-800',
    'Daihatsu': 'from-emerald-600 to-emerald-800',
  }
  return colors[car.merk] || 'from-slate-700 to-slate-900'
}

export const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Terjadi kesalahan' }))
    throw new Error(err.error || 'Terjadi kesalahan')
  }
  return res.json()
}
