/**
 * Header.jsx
 * ==========
 * Komponen header/navbar utama aplikasi.
 * 
 * PENJELASAN THEME SWITCHER:
 * --------------------------
 * ThemeSwitcherMinimal digunakan di sini karena:
 * 1. Ukurannya compact, cocok untuk navbar
 * 2. Tidak ada border, menyatu dengan design navbar
 * 3. Ditempatkan di sebelah hamburger menu (mobile) dan di navbar (desktop)
 */

import React, { useState, useEffect } from 'react'
import Logo from './fragments/Logo'
import Navbar from './fragments/Navbar'
import { ThemeSwitcherMinimal } from '../ThemeSwitcher'
import { LanguageSwitcherMinimal } from '../LanguageSwitcher'

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
          scrolled ? 'bg-slate-400/90 dark:bg-gray-800/90 shadow-md' : 'bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/50'
        }`}
      >
        {!mobileMenuOpen && <Logo onClick={handleLinkClick} />}

        {/* Desktop: tampilkan Navbar + Language + Theme Switcher */}
        <div className='hidden lg:flex lg:items-center lg:gap-4'>
          <Navbar scrolled={scrolled} />
          {/* Language Switcher untuk desktop */}
          <LanguageSwitcherMinimal />
          {/* Theme Switcher untuk desktop */}
          <ThemeSwitcherMinimal />
        </div>

        {/* Mobile: Language + Theme Switcher + Hamburger */}
        <div className='flex items-center gap-2 lg:hidden'>
          {/* Language Switcher untuk mobile */}
          {!mobileMenuOpen && <LanguageSwitcherMinimal />}
          {/* Theme Switcher untuk mobile */}
          {!mobileMenuOpen && <ThemeSwitcherMinimal />}
          
          {/* Hamburger HANYA jika menu TIDAK terbuka */}
          {!mobileMenuOpen && (
            <button
              className='text-2xl text-gray-700 dark:text-gray-200 focus:outline-none'
              onClick={toggleMobileMenu}
              aria-label='Open menu'
            >
              <i className='ri-menu-3-line'></i>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Sidebar — HANYA SATU BLOK INI YANG DIPAKAI */}
      {mobileMenuOpen && (
        <div
          className='fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col p-6 lg:hidden'
          onClick={stopPropagation}
        >
          {/* Baris atas: X (kiri) + Logo (kanan) */}
          <div className='flex justify-between items-center mb-8'>
            {/* Tombol Close (X) di kiri */}
            <button
              className='text-2xl text-gray-700 dark:text-gray-200 focus:outline-none'
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
