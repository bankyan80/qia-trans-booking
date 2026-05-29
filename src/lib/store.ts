import { create } from 'zustand'
import type { UserType, CarType, BookingType, SettingsType, DashboardType } from './types'
import { apiFetch } from './helpers'

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
  nama_mobil: string; merk: string; tipe: string; tahun: number; transmisi: string
  kapasitas: number; nomor_polisi: string; warna: string; harga_harian: number; harga_sopir: number
  deposit: number; biaya_antar_jemput: number; status: string; foto_url: string; deskripsi: string
}

export interface SettingsFormState {
  nama_perusahaan: string; nama_aplikasi: string; no_wa_admin: string; alamat_perusahaan: string
  rekening_bank: string; qris_url: string; logo_url: string; warna_utama: string
}

export interface HandoverFormState {
  km_awal: number; km_akhir: number; bbm_awal: string; bbm_akhir: string
  catatan_awal: string; catatan_akhir: string; denda: number; denda_keterangan: string; status_deposit: string
  foto_awal_url: string; foto_akhir_url: string
}

export interface PaymentFormState {
  metode: string; jumlah_bayar: number; bukti_bayar_url: string
}

const defaultBookingForm: BookingFormState = {
  tanggal_mulai: '', jam_mulai: '08:00', tanggal_selesai: '', jam_selesai: '08:00',
  nama_penyewa: '', no_wa: '', alamat: '', nik: '', no_sim: '',
  jenis_sewa: 'lepas_kunci', lokasi_jemput: '', ktp_url: '', sim_url: '',
}

const defaultCarForm: CarFormState = {
  nama_mobil: '', merk: '', tipe: '', tahun: 2024, transmisi: 'Automatic',
  kapasitas: 5, nomor_polisi: '', warna: '', harga_harian: 0, harga_sopir: 0,
  deposit: 0, biaya_antar_jemput: 0, status: 'Tersedia', foto_url: '', deskripsi: '',
}

const defaultSettingsForm: SettingsFormState = {
  nama_perusahaan: '', nama_aplikasi: '', no_wa_admin: '', alamat_perusahaan: '',
  rekening_bank: '', qris_url: '', logo_url: '', warna_utama: '#0f172a',
}

const defaultHandoverForm: HandoverFormState = {
  km_awal: 0, km_akhir: 0, bbm_awal: '', bbm_akhir: '',
  catatan_awal: '', catatan_akhir: '', denda: 0, denda_keterangan: '', status_deposit: 'Belum Dikembalikan',
  foto_awal_url: '', foto_akhir_url: '',
}

const defaultPaymentForm: PaymentFormState = {
  metode: 'Transfer Bank', jumlah_bayar: 0, bukti_bayar_url: '',
}

interface AppState {
  user: UserType | null
  cars: CarType[]
  bookings: BookingType[]
  allBookings: BookingType[]
  settings: SettingsType | null
  dashboard: DashboardType | null
  loading: boolean
  selectedCar: CarType | null
  selectedBooking: BookingType | null
  selectedCarForEdit: CarType | null
  filterStatus: string
  calendarMonth: Date
  bookingForm: BookingFormState
  carForm: CarFormState
  settingsForm: SettingsFormState
  handoverForm: HandoverFormState
  paymentForm: PaymentFormState

  setUser: (user: UserType | null) => void
  setLoading: (loading: boolean) => void
  setSelectedCar: (car: CarType | null) => void
  setSelectedBooking: (booking: BookingType | null) => void
  setSelectedCarForEdit: (car: CarType | null) => void
  setFilterStatus: (status: string) => void
  setCalendarMonth: (d: Date) => void
  setBookingForm: (fn: BookingFormState | ((prev: BookingFormState) => BookingFormState)) => void
  setCarForm: (fn: CarFormState | ((prev: CarFormState) => CarFormState)) => void
  setSettingsForm: (fn: SettingsFormState | ((prev: SettingsFormState) => SettingsFormState)) => void
  setHandoverForm: (fn: HandoverFormState | ((prev: HandoverFormState) => HandoverFormState)) => void
  setPaymentForm: (fn: PaymentFormState | ((prev: PaymentFormState) => PaymentFormState)) => void
  resetBookingForm: () => void
  resetCarForm: () => void
  resetHandoverForm: () => void
  resetPaymentForm: () => void

  fetchCars: (status?: string) => Promise<void>
  fetchSettings: () => Promise<void>
  fetchMyBookings: (userId: string) => Promise<void>
  fetchAllBookings: () => Promise<void>
  fetchDashboard: () => Promise<void>
  login: (email: string, password: string) => Promise<UserType>
  googleLogin: (credential: string) => Promise<UserType>
  logout: () => Promise<void>
  handleCreateBooking: (userId: string, carId: string) => Promise<{ kode_booking: string }>
  handleCreatePayment: (bookingId: string, userId: string, form: PaymentFormState) => Promise<void>
  handleUpdateBookingStatus: (bookingId: string, status_booking: string) => Promise<void>
  handleUpdatePaymentStatus: (paymentId: string, status: string) => Promise<void>
  handleSaveCar: (isEdit: boolean, carId?: string) => Promise<void>
  handleDeleteCar: (carId: string) => Promise<void>
  handleSaveSettings: (form: SettingsFormState) => Promise<void>
  handleCreateHandover: (bookingId: string, form: HandoverFormState) => Promise<void>
  handleSeed: () => Promise<void>
  uploadFile: (file: File) => Promise<string>
  openWhatsApp: (phone: string, message: string) => void
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  cars: [],
  bookings: [],
  allBookings: [],
  settings: null,
  dashboard: null,
  loading: false,
  selectedCar: null,
  selectedBooking: null,
  selectedCarForEdit: null,
  filterStatus: 'all',
  calendarMonth: new Date(),
  bookingForm: { ...defaultBookingForm },
  carForm: { ...defaultCarForm },
  settingsForm: { ...defaultSettingsForm },
  handoverForm: { ...defaultHandoverForm },
  paymentForm: { ...defaultPaymentForm },

  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('qiatrans_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('qiatrans_user')
    }
  },

  setLoading: (loading) => set({ loading }),
  setSelectedCar: (car) => set({ selectedCar: car }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  setSelectedCarForEdit: (car) => set({ selectedCarForEdit: car }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setCalendarMonth: (d) => set({ calendarMonth: d }),

  setBookingForm: (fn) => set((s) => ({
    bookingForm: typeof fn === 'function' ? (fn as (p: BookingFormState) => BookingFormState)(s.bookingForm) : fn,
  })),
  setCarForm: (fn) => set((s) => ({
    carForm: typeof fn === 'function' ? (fn as (p: CarFormState) => CarFormState)(s.carForm) : fn,
  })),
  setSettingsForm: (fn) => set((s) => ({
    settingsForm: typeof fn === 'function' ? (fn as (p: SettingsFormState) => SettingsFormState)(s.settingsForm) : fn,
  })),
  setHandoverForm: (fn) => set((s) => ({
    handoverForm: typeof fn === 'function' ? (fn as (p: HandoverFormState) => HandoverFormState)(s.handoverForm) : fn,
  })),
  setPaymentForm: (fn) => set((s) => ({
    paymentForm: typeof fn === 'function' ? (fn as (p: PaymentFormState) => PaymentFormState)(s.paymentForm) : fn,
  })),
  resetBookingForm: () => set({ bookingForm: { ...defaultBookingForm } }),
  resetCarForm: () => set({ carForm: { ...defaultCarForm } }),
  resetHandoverForm: () => set({ handoverForm: { ...defaultHandoverForm } }),
  resetPaymentForm: () => set({ paymentForm: { ...defaultPaymentForm } }),

  fetchCars: async (status) => {
    try {
      const url = status && status !== 'all' ? `/api/cars?status=${status}` : '/api/cars'
      const data = await apiFetch(url)
      set({ cars: data })
    } catch (e) {
      console.error(e)
    }
  },

  fetchSettings: async () => {
    try {
      const data = await apiFetch('/api/settings')
      set({ settings: data })
    } catch (e) {
      console.error(e)
    }
  },

  fetchMyBookings: async (userId) => {
    try {
      const data = await apiFetch(`/api/bookings?user_id=${userId}`)
      set({ bookings: data })
    } catch (e) {
      console.error(e)
    }
  },

  fetchAllBookings: async () => {
    try {
      const data = await apiFetch('/api/bookings')
      set({ allBookings: data })
    } catch (e) {
      console.error(e)
    }
  },

  fetchDashboard: async () => {
    try {
      const data = await apiFetch('/api/dashboard')
      set({ dashboard: data })
    } catch (e) {
      console.error(e)
    }
  },

  login: async (email, password) => {
    const data = await apiFetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    set({ user: data.user })
    localStorage.setItem('qiatrans_user', JSON.stringify(data.user))
    return data.user
  },

  googleLogin: async (credential) => {
    const data = await apiFetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ google_token: credential, provider: 'google' }),
    })
    set({ user: data.user })
    localStorage.setItem('qiatrans_user', JSON.stringify(data.user))
    return data.user
  },

  logout: async () => {
    try {
      await apiFetch('/api/auth', { method: 'DELETE' })
    } catch { /* ignore */ }
    set({ user: null })
    localStorage.removeItem('qiatrans_user')
  },

  handleCreateBooking: async (userId, carId) => {
    const { bookingForm } = get()
    const data = await apiFetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bookingForm, user_id: userId, car_id: carId }),
    })
    return data
  },

  handleCreatePayment: async (bookingId, userId, form) => {
    await apiFetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, user_id: userId, ...form }),
    })
  },

  handleUpdateBookingStatus: async (bookingId, status_booking) => {
    await apiFetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_booking }),
    })
  },

  handleUpdatePaymentStatus: async (paymentId, status) => {
    await apiFetch(`/api/payments/${paymentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  },

  handleSaveCar: async (isEdit, carId) => {
    const { carForm, selectedCarForEdit } = get()
    if (isEdit && (carId || selectedCarForEdit?.id)) {
      await apiFetch(`/api/cars/${carId || selectedCarForEdit!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carForm),
      })
    } else {
      await apiFetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carForm),
      })
    }
  },

  handleDeleteCar: async (carId) => {
    await apiFetch(`/api/cars/${carId}`, { method: 'DELETE' })
  },

  handleSaveSettings: async (form) => {
    await apiFetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
  },

  handleCreateHandover: async (bookingId, form) => {
    await apiFetch('/api/handover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId, ...form }),
    })
  },

  handleSeed: async () => {
    const data = await apiFetch('/api/seed')
    return data
  },

  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const data = await apiFetch('/api/upload', { method: 'POST', body: formData })
    return data.url
  },

  openWhatsApp: (phone, message) => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  },
}))
