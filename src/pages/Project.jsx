import { useState, memo } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import 'remixicon/fonts/remixicon.css'
import Button from '../components/Button'
import { listProject } from '../data/data'

const AnimatedProjectCard = memo(({ project, t }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className={`project-card-hover bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-xl shadow-slate-200 dark:shadow-gray-900/50 transition-all duration-300 ${
        inView ? 'animate__animated animate__fadeInUp' : ''
      }`}
    >
      <div className='h-48 bg-slate-100 dark:bg-gray-700 flex items-center justify-center p-4 relative'>
        {!imageLoaded && project.image_url && (
          <div className='absolute inset-0 bg-gray-200 dark:bg-gray-600 animate-pulse' />
        )}

        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            loading='lazy'
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`w-full h-full object-contain max-w-[90%] max-h-[90%] transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className='w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
            <span className='text-gray-400'>{t('common.noImage')}</span>
          </div>
        )}
      </div>

      <div className='p-6 flex flex-col flex-grow'>
        <h3 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3'>
          {project.title}
        </h3>

        {project.tools?.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-5'>
            {project.tools.map((tool, id) => (
              <span
                key={id}
                className='px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-full'
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        <p className='text-slate-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed'>
          {project.descripstion || t('projects.noDescription')}
        </p>

        <div className='flex justify-center gap-3'>
          {project.referance_url && (
            <Button
              onClick={() =>
                window.open(project.referance_url, '_blank', 'noopener,noreferrer')
              }
            >
              {t('projects.viewProject')}
            </Button>
          )}
          {project.github_url && (
            <button
              onClick={() =>
                window.open(project.github_url, '_blank', 'noopener,noreferrer')
              }
              className='px-4 py-3 text-sm font-semibold border-2 border-gray-300 dark:border-gray-500 rounded-xl bg-transparent text-gray-700 dark:text-gray-200 hover:border-transparent hover:bg-gradient-to-br hover:from-blue-400 hover:to-cyan-400 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer'
            >
              <i className='ri-github-fill text-xl' />
              GitHub
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

AnimatedProjectCard.displayName = 'AnimatedProjectCard'

const LoadingSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className='bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-xl shadow-slate-200 dark:shadow-gray-900/50 animate-pulse'
      >
        <div className='h-48 bg-gray-200 dark:bg-gray-700' />
        <div className='p-6'>
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3' />
          <div className='flex gap-2 mb-5'>
            <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16' />
            <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20' />
          </div>
          <div className='space-y-2 mb-6'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full' />
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6' />
          </div>
          <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto' />
        </div>
      </div>
    ))}
  </div>
)

const Project = () => {
  const projects = listProject
  const { t } = useTranslation()

  return (
    <div className='w-full py-20 px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors duration-300'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-16 text-center'>
          {t('projects.title')}
        </h2>

        {projects.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project) => (
              <AnimatedProjectCard key={project.id} project={project} t={t} />
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              {t('projects.noProjects')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Project
