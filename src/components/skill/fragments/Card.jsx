import { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { listTools } from '../../../data/data'

const AnimatedCard = memo(({ skill, index, t }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <Link
      ref={ref}
      to={`/skill/${skill.id}`}
      className={`block ${inView ? 'animate__animated animate__fadeInRight' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className='bg-slate-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex items-center p-3 sm:p-4 group cursor-pointer overflow-hidden'>
        <div className='shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-2 sm:mr-3 relative'>
          {!imageLoaded && skill.image_url && (
            <div className='absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse rounded' />
          )}

          {skill.image_url ? (
            <img
              src={skill.image_url}
              alt={skill.keterangan || skill.name}
              loading='lazy'
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className='w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center'>
              <span className='text-gray-400 text-xs'>{t('common.noImage')}</span>
            </div>
          )}
        </div>

        <div className='flex flex-col justify-center min-w-0'>
          <h3 className='text-black dark:text-white font-semibold text-xs sm:text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate'>
            {skill.name || 'Framework / Library'}
          </h3>
          <p className='text-gray-500 dark:text-gray-400 text-xs mt-0.5 sm:mt-1'>
            {skill.keterangan || t('skills.noDescription')}
          </p>
        </div>
      </div>
    </Link>
  )
})

AnimatedCard.displayName = 'AnimatedCard'

const LoadingSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-16'>
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className='bg-slate-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center p-3 sm:p-4 animate-pulse'
      >
        <div className='shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 dark:bg-gray-600 rounded mr-2 sm:mr-3' />
        <div className='flex-1 min-w-0'>
          <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2' />
          <div className='h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2' />
        </div>
      </div>
    ))}
  </div>
)

const Card = () => {
  const skills = listTools
  const { t } = useTranslation()

  if (skills.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-gray-500 dark:text-gray-400 text-lg'>
          {t('skills.noSkills')}
        </p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-16'>
        {skills.map((skill, index) => (
          <AnimatedCard key={skill.id} skill={skill} index={index} t={t} />
        ))}
      </div>
    </div>
  )
}

export default Card
