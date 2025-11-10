// components/Header.jsx
import React, { useState, useEffect } from 'react'
import Logo from './fragments/Logo'
import Navbar from './fragments/Navbar'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Deteksi scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false)
    }
    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  const toggleMobileMenu = e => {
    e.stopPropagation()
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLinkClick = () => {
    setMobileMenuOpen(false) // Tutup mobile menu setelah klik link
  }

  const stopPropagation = e => e.stopPropagation()

  return (
    <>
      {/* Overlay mobile */}
      {mobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/30 z-40 lg:hidden'
          onClick={() => setMobileMenuOpen(true)}
        ></div>
      )}

      {/* Header utama */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 flex justify-between items-center transition-all duration-300 ${
          scrolled ? 'bg-slate-400/90 shadow-md' : 'bg-white shadow-md'
        }`}
      >
        {!mobileMenuOpen && <Logo onClick={handleLinkClick} />}

        {/* Desktop: tampilkan Navbar */}
        <div className='hidden lg:block'>
          <Navbar scrolled={scrolled} />
        </div>

        {/* Mobile: Tampilkan Hamburger HANYA jika menu TIDAK terbuka */}
        {!mobileMenuOpen && (
          <button
            className='lg:hidden text-2xl text-gray-700 focus:outline-none'
            onClick={toggleMobileMenu}
            aria-label='Open menu'
          >
            <i className='ri-menu-3-line'></i>
          </button>
        )}
      </header>

      {/* Mobile Menu Sidebar — HANYA SATU BLOK INI YANG DIPAKAI */}
      {mobileMenuOpen && (
        <div
          className='fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 flex flex-col p-6 lg:hidden'
          onClick={stopPropagation}
        >
          {/* Baris atas: X (kiri) + Logo (kanan) */}
          <div className='flex justify-between items-center mb-8'>
            {/* Tombol Close (X) di kiri */}
            <button
              className='text-2xl text-gray-700 focus:outline-none'
              onClick={() => setMobileMenuOpen(false)}
              aria-label='Close menu'
            >
              <i className='ri-close-line'></i>
            </button>

            {/* Logo di kanan */}
            <div className='ml-auto scale-90'>
              <Logo onClick={handleLinkClick} />
            </div>
          </div>

          {/* Daftar Navigasi */}
          <Navbar onLinkClick={handleLinkClick} />
        </div>
      )}
    </>
  )
}

export default Header
