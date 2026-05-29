export interface UserType {
  id: string
  nama: string
  email: string
  no_wa: string
  role: string
}

export interface CarType {
  id: string
  nama_mobil: string
  merk: string
  tipe: string
  tahun: number
  transmisi: string
  kapasitas: number
  nomor_polisi: string
  warna: string
  harga_harian: number
  harga_sopir: number
  deposit: number
  biaya_antar_jemput: number
  status: string
  foto_url: string
  deskripsi: string
  createdat: string
  updatedat: string
}

export interface BookingType {
  id: string
  kode_booking: string
  user_id: string
  car_id: string
  nama_penyewa: string
  no_wa: string
  alamat: string
  nik: string
  no_sim: string
  ktp_url: string
  sim_url: string
  tanggal_mulai: string
  jam_mulai: string
  tanggal_selesai: string
  jam_selesai: string
  durasi_hari: number
  jenis_sewa: string
  lokasi_jemput: string
  biaya_sewa: number
  biaya_sopir: number
  biaya_antar_jemput: number
  deposit: number
  total_biaya: number
  status_booking: string
  status_pembayaran: string
  createdat: string
  updatedat: string
  car?: CarType
  user?: { id: string; nama: string; email: string; no_wa: string }
  payments?: PaymentType[]
  handovers?: HandoverType[]
}

export interface PaymentType {
  id: string
  booking_id: string
  user_id: string
  metode: string
  jumlah_bayar: number
  bukti_bayar_url: string
  status: string
  tanggal_bayar: string
  verified_at: string
  createdat: string
  booking?: BookingType & { car?: CarType }
}

export interface HandoverType {
  id: string
  booking_id: string
  km_awal: number
  km_akhir: number
  bbm_awal: string
  bbm_akhir: string
  foto_awal_url: string
  foto_akhir_url: string
  catatan_awal: string
  catatan_akhir: string
  denda: number
  denda_keterangan: string
  status_deposit: string
  createdat: string
  updatedat: string
  booking?: BookingType & { car?: CarType }
}

export interface SettingsType {
  id: string
  nama_perusahaan: string
  nama_aplikasi: string
  no_wa_admin: string
  alamat_perusahaan: string
  rekening_bank: string
  qris_url: string
  logo_url: string
  warna_utama: string
}

export interface DashboardType {
  totalCars: number
  availableCars: number
  rentedCars: number
  maintenanceCars: number
  todayBookings: number
  monthlyRevenue: number
  recentBookings: (BookingType & { car?: CarType; user?: { id: string; nama: string; email: string; no_wa: string } })[]
  bookingStatusCounts: { status_booking: string; _count: { status_booking: number } }[]
}

export type ViewType =
  | 'home' | 'carDetail' | 'bookingForm' | 'myBookings'
  | 'bookingDetail' | 'profile' | 'login' | 'terms' | 'invoice'
  | 'adminDashboard' | 'adminCars' | 'adminCarForm'
  | 'adminBookings' | 'adminBookingDetail' | 'adminReports'
  | 'adminSettings' | 'adminHandover'

export interface BookingFormState {
  tanggal_mulai: string
  jam_mulai: string
  tanggal_selesai: string
  jam_selesai: string
  nama_penyewa: string
  no_wa: string
  alamat: string
  nik: string
  no_sim: string
  jenis_sewa: string
  lokasi_jemput: string
  ktp_url: string
  sim_url: string
}

export interface CarFormState {
  nama_mobil: string
  merk: string
  tipe: string
  tahun: number
  transmisi: string
  kapasitas: number
  nomor_polisi: string
  warna: string
  harga_harian: number
  harga_sopir: number
  deposit: number
  biaya_antar_jemput: number
  status: string
  foto_url: string
  deskripsi: string
}

export interface SettingsFormState {
  nama_perusahaan: string
  nama_aplikasi: string
  no_wa_admin: string
  alamat_perusahaan: string
  rekening_bank: string
  qris_url: string
  logo_url: string
  warna_utama: string
}

export interface HandoverFormState {
  km_awal: number
  km_akhir: number
  bbm_awal: string
  bbm_akhir: string
  catatan_awal: string
  catatan_akhir: string
  denda: number
  denda_keterangan: string
  status_deposit: string
  foto_awal_url: string
  foto_akhir_url: string
}

export interface PaymentFormState {
  metode: string
  jumlah_bayar: number
  bukti_bayar_url: string
}
