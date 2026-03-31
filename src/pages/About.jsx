import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import AboutExperience from '../components/about/AboutExperience'

const About = () => {
  const { t } = useTranslation()

  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
  })

  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
  })

  return (
    <div className='py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4'>
            {t('about.title')}
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            {t('about.subtitle')}
          </p>
        </div>

        {/* Konten Utama */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
          {/* Teks */}
          <div
            ref={textRef}
            className={`space-y-6 ${
              textInView ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <p className='text-gray-800 dark:text-gray-200 text-lg leading-relaxed'>
              {t('about.intro')} <strong>Fiky</strong> {t('about.description1')}
            </p>
            <p className='text-gray-800 dark:text-gray-200 text-lg leading-relaxed'>
              {t('about.description2')}{' '}
              <strong>{t('about.highlight')}</strong>
              {t('about.description3')}
            </p>

            {/* CTA Button */}
            <div className='pt-4'>
              <Link to='/project'>
                <Button>{t('about.viewProjects')}</Button>
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className='flex gap-6 pt-4'>
              <a
                href='https://instagram.com/filas756'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
              >
                <i className='ri-instagram-fill ri-2x text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200'></i>
              </a>
              <a
                href='https://linkedin.com/in/fiky'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'
              >
                <i className='ri-linkedin-fill ri-2x text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200'></i>
              </a>
            </div>
          </div>

          {/* Gambar 3d */}
          <figure>
            <div className='.hero-3d-layout'>
              <AboutExperience/>
            </div>
          </figure>
        </div>
      </div>
    </div>
  )
}

export default About
