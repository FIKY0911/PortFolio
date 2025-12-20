import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Navbar = ({ scrolled = false, onLinkClick }) => {
  const { t } = useTranslation()

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/skill/detail', label: t('nav.skill') },
    { path: '/project', label: t('nav.project') },
    { path: '/contact', label: t('nav.contact') },
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <div className='hidden lg:flex gap-6 font-semibold text-xl'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className={`px-4 py-2 rounded-xl transition-all duration-300 relative
              ${scrolled ? 'text-slate-100' : 'text-slate-400 dark:text-gray-300'}
              hover:text-slate-100
              hover:bg-gradient-to-br from-cyan-400 to-blue-400
              hover:ring-2 hover:ring-cyan-300/70
              hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className='lg:hidden flex flex-col gap-5 py-2'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className='text-xl font-semibold text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition'
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  )
}

export default Navbar
