'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, CalendarDays, FileText, MessageCircle, ChevronRight, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'

interface ProfileViewProps {
  navigate: (view: string) => void
}

export function ProfileView({ navigate }: ProfileViewProps) {
  const { toast } = useToast()
  const user = useStore(s => s.user)
  const logout = useStore(s => s.logout)
  const openWhatsApp = useStore(s => s.openWhatsApp)
  const settings = useStore(s => s.settings)

  const handleLogoutAction = async () => {
    await logout()
    toast({ title: 'Logout Berhasil', description: 'Sampai jumpa lagi!' })
    navigate('home')
  }

  if (!user) return null

  return (
    <div className="max-w-md mx-auto px-4 pb-20 space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Profil Saya</h1>
      <Card className="p-6 border-slate-100 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-800 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{user.nama}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>
        <p className="text-sm text-slate-500">{user.no_wa}</p>
        <Badge className="mt-2">{user.role === 'admin' ? 'Administrator' : 'Pelanggan'}</Badge>
      </Card>

      <Card className="p-4 border-slate-100 space-y-3">
        <h3 className="font-semibold text-slate-900">Menu</h3>
        <button onClick={() => navigate('myBookings')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3"><CalendarDays className="w-5 h-5 text-slate-500" /><span className="text-sm">Booking Saya</span></div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <button onClick={() => navigate('terms')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-500" /><span className="text-sm">Syarat & Ketentuan</span></div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <button onClick={() => openWhatsApp(settings?.no_wa_admin || '6281234567890', 'Halo, saya butuh bantuan')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3"><MessageCircle className="w-5 h-5 text-green-600" /><span className="text-sm">Hubungi Admin</span></div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </Card>

      <Button variant="outline" className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogoutAction}>
        <LogOut className="w-4 h-4 mr-2" /> Keluar
      </Button>
    </div>
  )
}
