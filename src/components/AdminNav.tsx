'use client'

import { Car, LayoutDashboard, ClipboardList, BarChart3, Settings } from 'lucide-react'
import type { ViewType } from '@/lib/types'

interface AdminNavProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

const navItems = [
  { view: 'adminDashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
  { view: 'adminCars' as ViewType, icon: Car, label: 'Mobil' },
  { view: 'adminBookings' as ViewType, icon: ClipboardList, label: 'Booking' },
  { view: 'adminReports' as ViewType, icon: BarChart3, label: 'Laporan' },
  { view: 'adminSettings' as ViewType, icon: Settings, label: 'Akun' },
]

export function AdminNav({ currentView, onNavigate }: AdminNavProps) {
  const isActive = (view: ViewType): boolean => {
    return currentView === view ||
      (view === 'adminCars' && currentView === 'adminCarForm') ||
      (view === 'adminBookings' && (currentView === 'adminBookingDetail' || currentView === 'adminHandover'))
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[56px] ${isActive(item.view) ? 'text-blue-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
