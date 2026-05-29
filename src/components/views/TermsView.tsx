'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

interface TermsViewProps {
  navigate: (view: string) => void
}

export function TermsView({ navigate }: TermsViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 space-y-4">
      <button onClick={() => navigate('home')} className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 py-2">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>
      <h1 className="text-xl font-bold text-slate-900">Syarat & Ketentuan</h1>
      <Card className="p-6 border-slate-100 space-y-4 text-sm text-slate-700">
        <section>
          <h2 className="font-bold text-slate-900 mb-2">1. Ketentuan Umum</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Pemesan wajib berusia minimal 21 tahun dan memiliki SIM A yang masih berlaku.</li>
            <li>Pemesan wajib melampirkan foto KTP dan SIM yang valid.</li>
            <li>Booking dianggap sah setelah dikonfirmasi oleh admin Qia Trans.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-slate-900 mb-2">2. Pembayaran</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>DP minimal 30% dari total biaya harus dibayarkan untuk konfirmasi booking.</li>
            <li>Pelunasan dilakukan sebelum mobil diserahkan.</li>
            <li>Deposit akan dikembalikan setelah mobil dikembalikan dalam kondisi baik.</li>
            <li>Pembatalan oleh pemesan: deposit tidak dapat dikembalikan.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-slate-900 mb-2">3. Sewa Lepas Kunci</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Pemesan wajib melampirkan KTP dan SIM A asli.</li>
            <li>NIK harus sesuai dengan KTP yang dilampirkan.</li>
            <li>Mobil hanya boleh dikemudikan oleh pemesan yang terdaftar.</li>
            <li>Dilarang menyerahkan kemudi ke orang lain tanpa izin.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-slate-900 mb-2">4. Sewa dengan Sopir</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Sopir bertugas dari jam 06.00 - 22.00 WIB.</li>
            <li>Lembur sopir dikenakan biaya tambahan Rp 50.000/jam.</li>
            <li>Akomodasi sopir (makan & menginap) menjadi tanggung jawab penyewa untuk perjalanan luar kota.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-slate-900 mb-2">5. Pengembalian Mobil</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Mobil harus dikembalikan tepat waktu sesuai kesepakatan.</li>
            <li>Keterlambatan pengembalian dikenakan denda per jam.</li>
            <li>Mobil harus dikembalikan dalam kondisi bersih dan bensin terisi penuh.</li>
            <li>Kerusakan atau kehilangan aksesoris menjadi tanggung jawab penyewa.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-slate-900 mb-2">6. Deposit</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Deposit wajib dibayarkan saat pengambilan mobil.</li>
            <li>Deposit dikembalikan 1-3 hari kerja setelah mobil dikembalikan dalam kondisi baik.</li>
            <li>Deposit dapat dipotong jika terdenda atau kerusakan.</li>
          </ul>
        </section>
      </Card>
    </div>
  )
}
