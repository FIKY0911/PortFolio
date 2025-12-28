/**
 * ScrollToTop.jsx
 * ===============
 * Komponen utility untuk scroll otomatis ke atas saat pindah route.
 * 
 * CARA KERJA:
 * - Menggunakan useLocation untuk deteksi perubahan route
 * - Setiap kali pathname berubah, scroll ke posisi (0, 0)
 * - Menggunakan behavior 'instant' untuk scroll langsung tanpa animasi
 * 
 * PENGGUNAAN:
 * - Ditaruh di RootLayout agar berjalan di semua route
 * - Return null karena tidak render apapun (hanya logic)
 * 
 * CATATAN:
 * - Bisa diganti 'smooth' jika ingin animasi scroll smooth
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // atau 'smooth' untuk animasi smooth
    })
  }, [pathname])

  return null
}

export default ScrollToTop
