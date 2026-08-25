import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDataStore } from '../../store/dataStore'

const HomeProject = () => {
  const { t } = useTranslation()
  const categories = useDataStore((state) => state.categories)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header Section - Centered */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-8">
            {t('projects.title', 'Projek Saya')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {t('about.intro')} Fiky {t('about.description1')} {t('about.description2')} <strong>{t('about.highlight')}</strong>{t('about.description3')}
          </p>
        </div>

        {/* Project Categories Grid - Conditional Centering & Optimized Spacing */}
        <div 
          ref={ref}
          className={`flex flex-wrap ${categories.length > 1 ? 'justify-center lg:justify-start lg:max-w-4xl lg:mx-auto' : 'justify-center'} gap-6 ${inView ? 'animate__animated animate__fadeInUp' : 'opacity-0'}`}
        >
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`w-full sm:w-[calc(50%-12px)] max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-700 p-8 text-left transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${categories.length === 1 ? 'mx-auto' : ''}`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t(`projects.categories.${category.key}`, category.title)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[3rem]">
                {t(`projects.categories.${category.key}_desc`)}
              </p>
              
              <Link to="/project" className="flex items-center gap-2 text-cyan-500 font-semibold hover:gap-3 transition-all duration-300">
                  {t('projects.viewDetail', 'Lihat detail')} 
                  <i className="ri-arrow-right-line" aria-hidden="true"></i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeProject
