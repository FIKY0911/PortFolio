/**
 * RootLayout.jsx
 * ==============
 * Layout utama aplikasi yang membungkus semua halaman.
 * Berisi Header (navbar) dan Footer yang muncul di semua halaman.
 * 
 * FITUR:
 * - ScrollToTop: Otomatis scroll ke atas saat pindah route
 * - Header: Navbar dengan logo, menu, theme switcher, language switcher
 * - Outlet: Tempat render konten halaman (dari React Router)
 * - Footer: Footer dengan info kontak dan navigasi
 * - Dark mode support dengan transition smooth
 * 
 * STRUKTUR:
 * - ScrollToTop (invisible, hanya logic)
 * - Header (fixed di atas)
 * - Main content (Outlet)
 * - Footer (di bawah)
 */

import React from 'react'
import Header from '../components/header/Header'
import { Outlet } from 'react-router-dom'
import Container from '../components/Container'
import Footer from '../components/footer/Footer'
import ScrollToTop from '../components/ScrollToTop'

const RootLayout = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
      <ScrollToTop />
      <header>
              <nav>
                <Header/>
              </nav>
      </header>
      <main>
        <Container>
            <Outlet/>
        </Container>
        <div className='pt-20'>
        <Footer/>
        </div>
      </main>
    </div>
  )
}

export default RootLayout
