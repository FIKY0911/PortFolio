/**
 * Navbar.jsx
 * ==========
 * Komponen navigasi menu untuk desktop dan mobile.
 * 
 * FITUR:
 * - Active state: Menu yang sedang aktif akan highlight
 * - Responsive: Layout berbeda untuk desktop dan mobile
 * - Multi-bahasa: Label menu dari file translasi
 * - Smooth transition dan hover effect
 * 
 * ACTIVE STATE:
 * - Desktop: Background gradient cyan-blue dengan glow effect
 * - Mobile: Text cyan dengan font bold
 * - Deteksi route menggunakan useLocation
 * 
 * Props:
 * - scrolled: Boolean untuk styling saat scroll (desktop)
 * - onLinkClick: Callback untuk close mobile menu saat klik link
 */

import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Navbar = ({ scrolled = false, onLinkClick }) => {
  const { t } = useTranslation()
  const location = useLocation()

  // Daftar menu navigasi
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/skill', label: t('nav.skill') },
    { path: '/project', label: t('nav.project') },
    { path: '/contact', label: t('nav.contact') },
  ]

  /**
   * Fungsi untuk cek apakah path sedang aktif
   * - Home (/): Hanya aktif jika exact match
   * - Skill (/skill): Aktif jika path dimulai dengan /skill (termasuk /skill/:id)
   * - Lainnya: Exact match
   */
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    // Untuk skill, cek jika path dimulai dengan /skill
    if (path === '/skill') {
      return location.pathname.startsWith('/skill')
    }
    return location.pathname === path
  }

  return (
    <>
      {/* Desktop Navbar */}
      <div className='hidden lg:flex gap-6 font-semibold text-xl' role="menubar">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            role="menuitem"
            aria-current={isActive(item.path) ? 'page' : undefined}
            className={`px-4 py-2 rounded-xl transition-all duration-300 relative
              ${
                isActive(item.path)
                  ? 'text-white bg-gradient-to-br from-cyan-400 to-blue-400 ring-2 ring-cyan-300/70 shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]'
                  : scrolled
                  ? 'text-slate-100 hover:text-slate-100 hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-400 hover:ring-2 hover:ring-cyan-300/70 hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-100 hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-400 hover:ring-2 hover:ring-cyan-300/70 hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]'
              }
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className='lg:hidden flex flex-col gap-5 py-2' role="menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            role="menuitem"
            aria-current={isActive(item.path) ? 'page' : undefined}
            className={`text-xl font-semibold transition ${
              isActive(item.path)
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  )
}

export default Navbar
