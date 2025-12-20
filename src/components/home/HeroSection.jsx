import { useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../Button'
import { useApi } from '../../hooks/useApi'

const HeroSection = () => {
  const { data: profile, loading: apiLoading } = useApi('/profile')
  const [imageLoaded, setImageLoaded] = useState(false)
  const { t, i18n } = useTranslation()

  const loading = apiLoading || (profile?.image_url && !imageLoaded)

  // Dynamic typing sequence based on language
  const typingSequence =
    i18n.language === 'id'
      ? [
          'Halo, Saya Fiky!☺️',
          2000,
          'Selamat Datang di Portofolio Saya!',
          2000,
          'Student | Web Developer🧑‍💻',
          2000,
          'Antusias | CyberSecurity',
          2000,
        ]
      : [
          'Hi, I am Fiky!☺️',
          2000,
          'Welcome to My Portfolio!',
          2000,
          'Student | Web Developer🧑‍💻',
          2000,
          'Enthusiast | CyberSecurity',
          2000,
        ]

  return (
    <div className='animate__animated animate__fadeIn'>
      <div className='relative bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-gray-900 dark:to-gray-900 text-white py-50 px-4 sm:px-6 md:px-8 lg:px-12 transition-colors duration-300 overflow-hidden'>
        {/* Dark mode glow effects */}
        <div className='hidden dark:block absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl' />
        <div className='hidden dark:block absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl' />
        <div className='hidden dark:block absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-blue-500/10 to-transparent' />

        <div className='relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16'>
          {/* Profile Image */}
          <div className='w-full lg:w-auto flex justify-center lg:justify-end order-1 lg:order-2'>
            <div className='gradient-border relative w-75 h-80 sm:w-80 sm:h-100 lg:w-96 lg:h-[30rem]'>
              {loading && (
                <div className='absolute inset-0 bg-white/20 animate-pulse z-10' />
              )}

              {profile?.image_url && (
                <img
                  src={profile.image_url}
                  alt={profile.name || 'Profile Image'}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover bg-white transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              {!apiLoading && (!profile || !profile.image_url) && (
                <div className='absolute inset-0 bg-white/10 flex items-center justify-center'>
                  <span className='text-white text-lg'>No profile image</span>
                </div>
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className='w-full max-w-lg text-center lg:text-left order-2 lg:order-1'>
            {loading ? (
              <div className='animate-pulse'>
                <div className='h-12 bg-white/20 rounded-lg mb-6 w-full' />
                <div className='h-12 bg-white/20 rounded-lg mb-15 w-3/4' />
                <div className='space-y-3 my-8'>
                  <div className='h-4 bg-white/20 rounded w-full' />
                  <div className='h-4 bg-white/20 rounded w-full' />
                  <div className='h-4 bg-white/20 rounded w-5/6' />
                </div>
                <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 w-full'>
                  <div className='h-12 bg-white/20 rounded-lg w-full sm:w-40' />
                  <div className='h-12 bg-white/20 rounded-lg w-full sm:w-40' />
                </div>
              </div>
            ) : (
              <>
                <TypeAnimation
                  key={i18n.language}
                  sequence={typingSequence}
                  wrapper='div'
                  cursor={true}
                  repeat={Infinity}
                  className='text-3xl sm:text-4xl font-semibold mb-15 leading-tight'
                  style={{ whiteSpace: 'pre-line' }}
                />

                <p className='text-lg my-8'>{t('hero.description')}</p>

                <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 w-full'>
                  <Link to='/project'>
                    <Button className='w-full'>{t('hero.viewProjects')}</Button>
                  </Link>
                  <Link
                    to='/'
                    className='w-full sm:w-auto text-center font-semibold px-6 py-3 rounded-lg border-2 border-white bg-transparent text-white hover:bg-white/10 hover:bg-gradient-to-br from-blue-400 to-cyan-400 transition'
                  >
                    {t('hero.downloadCV')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
