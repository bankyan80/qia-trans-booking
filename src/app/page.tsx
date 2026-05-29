'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'
import type { ViewType } from '@/lib/types'
import { formatDate, apiFetch } from '@/lib/helpers'

import { AppHeader } from '@/components/AppHeader'
import { CustomerNav } from '@/components/CustomerNav'
import { AdminNav } from '@/components/AdminNav'
import { AdminSidebar } from '@/components/AdminSidebar'
import { LoginView } from '@/components/views/LoginView'
import { HomeView } from '@/components/views/HomeView'
import { CarDetailView } from '@/components/views/CarDetailView'
import { BookingFormView } from '@/components/views/BookingFormView'
import { MyBookingsView } from '@/components/views/MyBookingsView'
import { BookingDetailView } from '@/components/views/BookingDetailView'
import { InvoiceView } from '@/components/views/InvoiceView'
import { ProfileView } from '@/components/views/ProfileView'
import { TermsView } from '@/components/views/TermsView'
import { AdminDashboardView } from '@/components/views/AdminDashboardView'
import { AdminCarsView } from '@/components/views/AdminCarsView'
import { AdminCarFormView } from '@/components/views/AdminCarFormView'
import { AdminBookingsView } from '@/components/views/AdminBookingsView'
import { AdminBookingDetailView } from '@/components/views/AdminBookingDetailView'
import { AdminHandoverView } from '@/components/views/AdminHandoverView'
import { AdminReportsView } from '@/components/views/AdminReportsView'
import { AdminSettingsView } from '@/components/views/AdminSettingsView'

export default function Home() {
  const { toast } = useToast()
  const user = useStore(s => s.user)
  const settings = useStore(s => s.settings)
  const setUser = useStore(s => s.setUser)
  const logout = useStore(s => s.logout)

  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [previousView, setPreviousView] = useState<ViewType>('home')
  const [navHistory, setNavHistory] = useState<ViewType[]>([])
  const [lastBackPress, setLastBackPress] = useState<number>(0)
  const [showExitDialog, setShowExitDialog] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('qiatrans_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch { /* ignore */ }
    }
  }, [setUser])

  function navigate(view: ViewType) {
    setPreviousView(currentView)
    setNavHistory(prev => [...prev, currentView])
    setCurrentView(view)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (!user && (currentView === 'myBookings' || currentView === 'profile' || currentView === 'bookingForm' || currentView === 'bookingDetail')) {
      navigate('login')
    }
  }, [user, currentView])

  const goBack = () => {
    const isHomeView = !user || user.role !== 'admin'
      ? currentView === 'home'
      : currentView === 'adminDashboard'

    if (isHomeView) {
      const now = Date.now()
      if (now - lastBackPress < 2000) {
        setShowExitDialog(true)
        setLastBackPress(0)
      } else {
        setLastBackPress(now)
        toast({ title: 'Tekan sekali lagi untuk keluar', description: 'Tekan tombol kembali 2x untuk keluar dari aplikasi' })
      }
      return
    }

    if (navHistory.length > 0) {
      const prevViews = [...navHistory]
      const prevView = prevViews.pop()!
      setNavHistory(prevViews)
      setPreviousView(currentView)
      setCurrentView(prevView)
      window.scrollTo(0, 0)
    } else {
      navigate(user?.role === 'admin' ? 'adminDashboard' : 'home')
    }
  }

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      goBack()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [currentView, navHistory, lastBackPress, user])

  useEffect(() => {
    if (currentView !== 'login') {
      window.history.pushState({ view: currentView }, '')
    }
  }, [currentView])

  const handleLogout = async () => {
    await logout()
    toast({ title: 'Logout Berhasil', description: 'Sampai jumpa lagi!' })
    navigate('home')
  }

  const isAdmin = user?.role === 'admin'

  if (currentView === 'login') {
    return <LoginView onSuccess={(role) => navigate(role === 'admin' ? 'adminDashboard' : 'home')} />
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader currentView={currentView} onNavigate={navigate} onBack={goBack} onLogout={handleLogout} />

      <main className={`${isAdmin ? 'lg:ml-64' : ''}`}>
        {currentView === 'home' && <HomeView navigate={navigate} />}
        {currentView === 'carDetail' && <CarDetailView navigate={navigate} />}
        {currentView === 'bookingForm' && <BookingFormView navigate={navigate} />}
        {currentView === 'myBookings' && <MyBookingsView navigate={navigate} />}
        {currentView === 'bookingDetail' && <BookingDetailView navigate={navigate} />}
        {currentView === 'invoice' && <InvoiceView navigate={navigate} />}
        {currentView === 'profile' && <ProfileView navigate={navigate} />}
        {currentView === 'terms' && <TermsView navigate={navigate} />}
        {currentView === 'adminDashboard' && <AdminDashboardView navigate={navigate} />}
        {currentView === 'adminCars' && <AdminCarsView navigate={navigate} />}
        {currentView === 'adminCarForm' && <AdminCarFormView navigate={navigate} />}
        {currentView === 'adminBookings' && <AdminBookingsView navigate={navigate} />}
        {currentView === 'adminBookingDetail' && <AdminBookingDetailView navigate={navigate} />}
        {currentView === 'adminHandover' && <AdminHandoverView navigate={navigate} />}
        {currentView === 'adminReports' && <AdminReportsView navigate={navigate} />}
        {currentView === 'adminSettings' && <AdminSettingsView navigate={navigate} />}
      </main>

      {isAdmin && <AdminSidebar currentView={currentView} onNavigate={navigate} onLogout={handleLogout} userName={user?.nama} />}
      {isAdmin && <AdminNav currentView={currentView} onNavigate={navigate} />}
      {!isAdmin && <CustomerNav currentView={currentView} onNavigate={navigate} />}

      {!isAdmin && currentView !== 'login' && (
        <button
          onClick={() => {
            const phone = settings?.no_wa_admin || '6281234567890'
            const msg = 'Halo, saya ingin bertanya tentang sewa mobil Qia Trans'
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
          }}
          className="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/40 flex items-center justify-center transition-all hover:scale-105"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </button>
      )}

      {showExitDialog && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowExitDialog(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Keluar Aplikasi?</h3>
            <p className="text-sm text-slate-500 mb-6">Apakah Anda yakin ingin keluar dari Qia Trans?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitDialog(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors">Batal</button>
              <button onClick={() => { if (typeof window !== 'undefined') window.close() }} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">Keluar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
