'use client'

import { Button } from '@/components/ui/button'
import { Car, ChevronLeft, LogOut } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { ViewType } from '@/lib/types'

interface AppHeaderProps {
  currentView: ViewType
  onNavigate: (view: ViewType) => void
  onBack: () => void
  onLogout: () => void
}

export function AppHeader({ currentView, onNavigate, onBack, onLogout }: AppHeaderProps) {
  const user = useStore(s => s.user)
  const isHomeView = user?.role === 'admin' ? currentView === 'adminDashboard' : currentView === 'home'
  const showBack = currentView !== 'home' && currentView !== 'login' && !isHomeView

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-1 h-9 w-9 p-0">
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </Button>
          )}
          <button onClick={() => onNavigate(user?.role === 'admin' ? 'adminDashboard' : 'home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Car className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight hidden sm:block">
              <h1 className="text-sm font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">Qia Trans</h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">Booking MobilKu</p>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 hidden sm:inline">{user.nama}</span>
              <Button variant="outline" size="sm" onClick={onLogout} className="text-xs">
                <LogOut className="w-3 h-3 mr-1" /> Keluar
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => onNavigate('login')} className="bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-md shadow-blue-500/20 text-xs">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/></svg>
              Masuk
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
