import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../Button'
import Logo from '../header/fragments/Logo'

const Footer = () => {
  const { t } = useTranslation()

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/skill', label: t('nav.skill')},
    { path: '/project', label: t('nav.project') },
    { path: '/contact', label: t('nav.contact') },
  ]

  return (
    <footer className='bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-15 px-4 sm:px-6 lg:px-8 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {/* Kolom 1: Brand & Deskripsi */}
          <div className='space-y-4'>
            <Logo />
            <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
              {t('footer.description')}
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
              {t('footer.navigation')}
            </h3>
            <ul className='space-y-2'>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className='text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-sm'
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
              {t('footer.contactTitle')}
            </h3>
            <address className='not-italic text-gray-600 dark:text-gray-400 text-sm space-y-2'>
              <p>Jl. Merdeka No. 10</p>
              <p>Jakarta, DKI 12345</p>
              <p>
                Email:{' '}
                <a
                  href='mailto:linkidnmohamadfiky@gmail.com'
                  className='hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors'
                >
                  linkidnmohamadfiky@gmail.com
                </a>
              </p>
            </address>
          </div>

          {/* Kolom 4: CTA */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
              {t('footer.collaborate')}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
              {t('footer.collaborateDesc')}
            </p>
            <Link to='/contact'>
              <Button>{t('footer.contactMe')}</Button>
            </Link>
          </div>
        </div>

        {/* Garis pemisah */}
        <div className='border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 text-center'>
          <p className='text-gray-500 dark:text-gray-400 text-sm font-light tracking-wide'>
            © {new Date().getFullYear()} Fiky. {t('footer.copyright')}{' '}
            <span className='inline-block mx-1 text-red-400 group cursor-pointer hover:scale-110 transition-transform duration-300'>
              ❤️
            </span>{' '}
            {t('footer.and')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
