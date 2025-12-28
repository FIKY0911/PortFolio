/**
 * ============================================================================
 * Project.jsx - Portfolio Projects Page
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. COMPONENT COMPOSITION PATTERN
 *    - AnimatedProjectCard: Reusable card component
 *    - LoadingSkeleton: Loading state component
 *    - Project: Main container component
 *    - Separation of concerns untuk maintainability
 * 
 * 2. REACT.MEMO OPTIMIZATION
 *    - memo() HOC untuk prevent unnecessary re-renders
 *    - Berguna untuk list items yang banyak
 *    - Shallow comparison props by default
 *    - Trade-off: Memory vs CPU (memoization cost)
 *    
 *    KAPAN GUNAKAN memo():
 *    ✓ Component render sering dengan props yang sama
 *    ✓ Component dalam list/map
 *    ✓ Pure component (output hanya depend on props)
 *    ✗ Props selalu berubah
 *    ✗ Component sudah cepat
 * 
 * 3. INTERSECTION OBSERVER PATTERN
 *    - useInView hook dari react-intersection-observer
 *    - Detect saat element masuk viewport
 *    - Trigger animasi hanya saat visible (performance)
 *    - triggerOnce: true → animasi hanya sekali
 *    - threshold: 0.1 → trigger saat 10% visible
 * 
 * 4. LAZY LOADING IMAGES
 *    - loading="lazy" attribute untuk native lazy load
 *    - imageLoaded state untuk smooth transition
 *    - Placeholder saat loading (skeleton/pulse)
 *    - onLoad/onError handlers untuk state management
 *    
 *    BENEFITS:
 *    - Faster initial page load
 *    - Reduced bandwidth usage
 *    - Better perceived performance
 * 
 * 5. CONDITIONAL RENDERING PATTERNS
 *    - Ternary operator untuk simple conditions
 *    - && operator untuk single condition
 *    - Optional chaining (?.) untuk safe access
 *    - Nullish coalescing (??) untuk default values
 * 
 * 6. WINDOW.OPEN SECURITY
 *    - 'noopener': Prevent window.opener access (security)
 *    - 'noreferrer': Don't send referrer header (privacy)
 *    - '_blank': Open in new tab
 *    - ALWAYS use noopener,noreferrer untuk external links
 * 
 * 7. SKELETON LOADING PATTERN
 *    - Better UX daripada spinner
 *    - Show layout structure saat loading
 *    - Reduce perceived loading time
 *    - animate-pulse untuk shimmer effect
 * 
 * 8. RESPONSIVE GRID LAYOUT
 *    - Mobile first approach
 *    - grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3
 *    - Automatic responsive tanpa media queries manual
 *    - gap untuk consistent spacing
 * 
 * BEST PRACTICES:
 * - Always memoize list item components
 * - Use lazy loading untuk images
 * - Implement loading states
 * - Security: noopener,noreferrer untuk external links
 * - Accessibility: alt text, aria-labels
 * - Performance: Intersection Observer untuk animasi
 * 
 * TIPS UNTUK JUNIOR:
 * - memo() bukan silver bullet, gunakan dengan bijak
 * - Test performance dengan React DevTools Profiler
 * - Skeleton loading > Spinner untuk better UX
 * - Always handle loading dan error states
 * - Security matters: sanitize external URLs
 */

import { useState, memo } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import 'remixicon/fonts/remixicon.css'
import Button from '../components/Button'
import { listProject } from '../data/data'

/**
 * AnimatedProjectCard Component
 * ==============================
 * Memoized card component untuk setiap project.
 * 
 * OPTIMIZATION TECHNIQUES:
 * 1. React.memo untuk prevent re-render
 * 2. Lazy loading images
 * 3. Intersection Observer untuk animasi
 * 4. Conditional rendering untuk performance
 * 
 * Props:
 * - project: Object {id, title, image_url, referance_url, github_url, descripstion, tools}
 * - t: Translation function dari i18n
 */
const AnimatedProjectCard = memo(({ project, t }) => {
  // Local state untuk track image loading status
  const [imageLoaded, setImageLoaded] = useState(false)

  // Intersection Observer untuk detect visibility
  const { ref, inView } = useInView({
    triggerOnce: true, // Animasi hanya sekali (performance)
    threshold: 0.1,    // Trigger saat 10% card visible
  })
  
  // Get translated project data based on project title
  const getTranslatedProject = (projectTitle) => {
    const projectKey = projectTitle.toLowerCase().replace(/\s+/g, '')
    return {
      title: t(`projects.list.${projectKey}.title`, projectTitle),
      description: t(`projects.list.${projectKey}.description`, project.descripstion),
      tools: t(`projects.list.${projectKey}.tools`, { returnObjects: true, defaultValue: project.tools })
    }
  }
  
  const translatedProject = getTranslatedProject(project.title)

  return (
    <div
      ref={ref}
      className={`project-card-hover bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-xl shadow-slate-200 dark:shadow-gray-900/50 transition-all duration-300 ${
        inView ? 'animate__animated animate__fadeInUp' : ''
      }`}
    >
      {/* Image Container dengan Lazy Loading */}
      <div className='h-48 bg-slate-100 dark:bg-gray-700 flex items-center justify-center p-4 relative'>
        {/* Skeleton placeholder saat image loading */}
        {!imageLoaded && project.image_url && (
          <div className='absolute inset-0 bg-gray-200 dark:bg-gray-600 animate-pulse' />
        )}

        {project.image_url ? (
          <img
            src={project.image_url}
            alt={translatedProject.title}
            loading='lazy' // Native lazy loading (browser feature)
            onLoad={() => setImageLoaded(true)}  // Set state saat image loaded
            onError={() => setImageLoaded(true)} // Handle error gracefully
            className={`w-full h-full object-contain max-w-[90%] max-h-[90%] transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          // Fallback jika tidak ada image
          <div className='w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
            <span className='text-gray-400'>{t('common.noImage')}</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className='p-6 flex flex-col flex-grow'>
        <h3 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3'>
          {translatedProject.title}
        </h3>

        {/* Tools/Tech Stack Tags */}
        {/* Optional chaining (?.) untuk safe access */}
        {Array.isArray(translatedProject.tools) && translatedProject.tools.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-5'>
            {translatedProject.tools.map((tool, id) => (
              <span
                key={id}
                className='px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-full'
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Description dengan fallback */}
        <p className='text-slate-600 dark:text-gray-400 text-sm mb-6 flex-grow leading-relaxed'>
          {translatedProject.description}
        </p>

        {/* Action Buttons */}
        <div className='flex justify-center gap-3'>
          {/* Conditional rendering: hanya tampilkan jika URL ada */}
          {project.referance_url && (
            <Button
              onClick={() =>
                // Security: noopener,noreferrer untuk prevent window.opener access
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

// DisplayName untuk React DevTools debugging
AnimatedProjectCard.displayName = 'AnimatedProjectCard'

/**
 * LoadingSkeleton Component
 * =========================
 * Skeleton loading state untuk better UX.
 * 
 * SKELETON PATTERN BENEFITS:
 * - Show layout structure saat loading
 * - Reduce perceived loading time
 * - Better UX daripada spinner
 * - User tahu apa yang akan muncul
 * 
 * IMPLEMENTATION:
 * - Replicate actual layout structure
 * - Use animate-pulse untuk shimmer effect
 * - Match dimensions dengan actual content
 */
const LoadingSkeleton = () => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
    {/* Array(6) untuk create 6 skeleton cards */}
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className='bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-xl shadow-slate-200 dark:shadow-gray-900/50 animate-pulse'
      >
        {/* Skeleton image */}
        <div className='h-48 bg-gray-200 dark:bg-gray-700' />
        <div className='p-6'>
          {/* Skeleton title */}
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3' />
          {/* Skeleton tags */}
          <div className='flex gap-2 mb-5'>
            <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16' />
            <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20' />
          </div>
          {/* Skeleton description */}
          <div className='space-y-2 mb-6'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full' />
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6' />
          </div>
          {/* Skeleton button */}
          <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto' />
        </div>
      </div>
    ))}
  </div>
)

/**
 * Project Component (Main)
 * ========================
 * Main container component untuk halaman projects.
 * 
 * DATA FLOW:
 * 1. Import data dari data.jsx (static data)
 * 2. Map data ke AnimatedProjectCard components
 * 3. Handle empty state dengan conditional rendering
 * 
 * RESPONSIVE DESIGN:
 * - Mobile: 1 column
 * - Tablet (md): 2 columns
 * - Desktop (lg): 3 columns
 */
const Project = () => {
  const projects = listProject
  const { t } = useTranslation()

  return (
    <div className='w-full py-20 px-4 sm:px-6 bg-white dark:bg-gray-900 transition-colors duration-300'>
      <div className='max-w-6xl mx-auto'>
        {/* Page Title dengan gradient text */}
        <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-16 text-center'>
          {t('projects.title')}
        </h2>

        {/* Conditional Rendering: Projects Grid atau Empty State */}
        {projects.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project) => (
              <AnimatedProjectCard key={project.id} project={project} t={t} />
            ))}
          </div>
        ) : (
          // Empty state jika tidak ada projects
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
