'use client'

import { Button } from '@/components/ui/button'
import { Car, LayoutDashboard, ClipboardList, BarChart3, Settings, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { ViewType } from '@/lib/types'

interface AdminSidebarProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onLogout: () => void
}

const menuItems = [
  { view: 'adminDashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { view: 'adminCars' as ViewType, icon: Car, label: 'Kelola Mobil' },
  { view: 'adminBookings' as ViewType, icon: ClipboardList, label: 'Kelola Booking' },
  { view: 'adminReports' as ViewType, icon: BarChart3, label: 'Laporan' },
  { view: 'adminSettings' as ViewType, icon: Settings, label: 'Pengaturan' },
]

export function AdminSidebar({ currentView, onNavigate, onLogout }: AdminSidebarProps) {
  const user = useStore(s => s.user)

  const isActive = (view: ViewType): boolean => {
    return currentView === view ||
      (view === 'adminCars' && currentView === 'adminCarForm') ||
      (view === 'adminBookings' && (currentView === 'adminBookingDetail' || currentView === 'adminHandover'))
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white min-h-screen fixed left-0 top-14 bottom-0 z-40 shadow-xl shadow-blue-500/10">
      <div className="p-6 border-b border-slate-700">
        <h2 className="font-bold text-lg">Admin Panel</h2>
        <p className="text-slate-400 text-sm">{user?.nama}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.view) ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/10 justify-start" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Keluar
        </Button>
      </div>
    </aside>
  )
}
