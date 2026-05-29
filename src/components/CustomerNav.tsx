'use client'

import { Car, Home as HomeIcon, CalendarDays, User } from 'lucide-react'
import type { ViewType } from '@/lib/types'

interface CustomerNavProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
}

const navItems = [
  { view: 'home' as ViewType, icon: HomeIcon, label: 'Beranda' },
  { view: 'home' as ViewType, icon: Car, label: 'Mobil' },
  { view: 'myBookings' as ViewType, icon: CalendarDays, label: 'Booking' },
  { view: 'profile' as ViewType, icon: User, label: 'Profil' },
]

export function CustomerNav({ currentView, onNavigate }: CustomerNavProps) {
  const isActive = (index: number): boolean => {
    if (index === 0) return currentView === 'home' || currentView === 'carDetail'
    if (index === 1) return currentView === 'home' || currentView === 'carDetail'
    if (index === 2) return currentView === 'myBookings' || currentView === 'bookingDetail' || currentView === 'bookingForm' || currentView === 'invoice'
    if (index === 3) return currentView === 'profile'
    return false
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[56px] ${isActive(i) ? 'text-blue-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
