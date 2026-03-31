/**
 * SkeletonLoading Component
 * Digunakan sebagai fallback saat lazy loading routes
 * Meniru struktur lengkap halaman Home (Hero + About + Skills + Projects + Contact)
 */
export const SkeletonLoading = () => (
  <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
    {/* Hero Section Skeleton */}
    <div className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-50 px-4 sm:px-6 md:px-8 lg:px-12'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16'>
        {/* Image Skeleton */}
        <div className='w-full lg:w-auto flex justify-center lg:justify-end order-1 lg:order-2'>
          <div className='w-75 h-80 sm:w-80 sm:h-100 lg:w-96 lg:h-[30rem] bg-white/20 rounded-lg animate-pulse'></div>
        </div>
        
        {/* Text Skeleton */}
        <div className='w-full max-w-lg text-center lg:text-left order-2 lg:order-1 animate-pulse'>
          <div className='h-12 bg-white/20 rounded-lg mb-6 w-full'></div>
          <div className='h-12 bg-white/20 rounded-lg mb-15 w-3/4'></div>
          <div className='space-y-3 my-8'>
            <div className='h-4 bg-white/20 rounded w-full'></div>
            <div className='h-4 bg-white/20 rounded w-full'></div>
            <div className='h-4 bg-white/20 rounded w-5/6'></div>
            <div className='h-4 bg-white/20 rounded w-full'></div>
            <div className='h-4 bg-white/20 rounded w-4/5'></div>
          </div>
          <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4'>
            <div className='h-12 bg-white/20 rounded-lg w-full sm:w-40'></div>
            <div className='h-12 bg-white/20 rounded-lg w-full sm:w-40'></div>
          </div>
        </div>
      </div>
    </div>

    {/* About Section Skeleton */}
    <div className='bg-white dark:bg-gray-900 py-20 px-4'>
      <div className='max-w-7xl mx-auto animate-pulse'>
        <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-12'></div>
        <div className='space-y-4 max-w-3xl mx-auto'>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6'></div>
          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
        </div>
      </div>
    </div>

    {/* Skills Section Skeleton */}
    <div className='bg-gray-50 dark:bg-gray-800 py-20 px-4'>
      <div className='max-w-7xl mx-auto animate-pulse'>
        <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-12'></div>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-32 bg-gray-200 dark:bg-gray-700 rounded-lg'></div>
          ))}
        </div>
      </div>
    </div>

    {/* Projects Section Skeleton */}
    <div className='bg-white dark:bg-gray-900 py-20 px-4'>
      <div className='max-w-7xl mx-auto animate-pulse'>
        <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-12'></div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='space-y-4'>
              <div className='h-48 bg-gray-200 dark:bg-gray-700 rounded-lg'></div>
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full'></div>
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6'></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Contact Section Skeleton */}
    <div className='bg-gray-50 dark:bg-gray-800 py-20 px-4'>
      <div className='max-w-7xl mx-auto animate-pulse'>
        <div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-12'></div>
        <div className='max-w-2xl mx-auto space-y-4'>
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full'></div>
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full'></div>
          <div className='h-32 bg-gray-200 dark:bg-gray-700 rounded-lg w-full'></div>
          <div className='h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-40'></div>
        </div>
      </div>
    </div>
  </div>
)
