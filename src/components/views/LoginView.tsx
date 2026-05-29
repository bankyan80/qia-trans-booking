'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, RefreshCw, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useStore } from '@/lib/store'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

interface LoginViewProps {
  onSuccess: (role: string) => void
}

export function LoginView({ onSuccess }: LoginViewProps) {
  const { toast } = useToast()
  const googleLogin = useStore(s => s.googleLogin)
  const setLoading = useStore(s => s.setLoading)
  const loading = useStore(s => s.loading)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const googleBtnRef = useRef<HTMLDivElement>(null)
  const [gisLoaded, setGisLoaded] = useState(false)

  useEffect(() => {
    if (!googleClientId || gisLoaded) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => setGisLoaded(true)
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [googleClientId, gisLoaded])

  useEffect(() => {
    if (!gisLoaded || !googleBtnRef.current || !googleClientId || !window.google) return
    googleBtnRef.current.innerHTML = ''
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response: { credential: string }) => {
        setLoading(true)
        try {
          const user = await googleLogin(response.credential)
          toast({ title: 'Login Berhasil', description: `Selamat datang, ${user.nama}` })
          onSuccess(user.role)
        } catch (e: unknown) {
          toast({ title: 'Login Gagal', description: e instanceof Error ? e.message : 'Terjadi kesalahan', variant: 'destructive' })
        } finally {
          setLoading(false)
        }
      },
    })
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      type: 'standard',
      shape: 'rectangular',
      theme: 'outline',
      text: 'signin_with',
      size: 'large',
      width: 320,
      logo_alignment: 'left',
    })
  }, [gisLoaded])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <Card className="w-full max-w-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Car className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Qia Trans</CardTitle>
          <p className="text-slate-500 text-sm">Booking MobilKu</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-5">Masuk untuk mulai booking mobil</p>
          </div>
          {googleClientId ? (
            <div className="flex justify-center">
              {gisLoaded ? (
                <div ref={googleBtnRef} />
              ) : (
                <Button className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-md flex items-center justify-center gap-3 font-medium" disabled>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Memuat...
                </Button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center">
              Login Google belum dikonfigurasi. Tambahkan NEXT_PUBLIC_GOOGLE_CLIENT_ID di .env
            </p>
          )}
          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            Dengan masuk, Anda menyetujui Syarat & Ketentuan Qia Trans
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
