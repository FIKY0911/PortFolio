import { useTranslation } from 'react-i18next'
import { useDataStore } from '../../store/dataStore'
import { Link } from 'react-router-dom'

const TechStackCards = () => {
  const { t } = useTranslation()
  const tools = useDataStore((state) => state.tools)

  const categories = [
    {
      key: 'languages',
      title: 'skills.languages',
      items: tools.filter(t =>
        ['Html', 'Css', 'Javascript', 'TypeScript'].includes(t.name)
      ),
      icon: 'ri-code-s-slash-line',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'
    },
    {
      key: 'frameworks',
      title: 'skills.frameworks',
      items: tools.filter(t =>
        ['Nextjs', 'Tailwind Css', 'Clerk', 'React'].includes(t.name)
      ),
      icon: 'ri-layout-4-line',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30'
    },
    {
      key: 'versionControl',
      title: 'skills.versionControl',
      items: tools.filter(t =>
        ['Git'].includes(t.name)
      ),
      icon: 'ri-git-branch-line',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30'
    }
  ]

const renderToolIcon = (tool) => {
    if (tool.image_url) {
      return (
        <Link to='/skill' className='group'>
          <img
            src={tool.image_url}
            alt={tool.name}
            className='w-16 h-16 object-contain'
          />
        </Link>
      )
    }
    return (
      <Link to='/skill' className='group'>
        <div className='w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center'>
          <i className='ri-git-branch-line text-xl text-orange-500' />
        </div>
      </Link>
    )
  }

  return (
    <section className='py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-14'>
          <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4'>
            {t('skills.techStack')}
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            {t('skills.techStackDesc')}
          </p>
        </div>

        <div className='flex flex-wrap justify-center gap-8 lg:gap-10'>
          {categories.map((category) => (
            <div
              key={category.key}
              className='bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 w-full sm:w-auto min-w-[280px] flex-1 flex flex-col min-h-[380px]'
            >
              <div className={`bg-gradient-to-br ${category.bgColor} -mx-8 -mt-8 px-8 pt-8 pb-6 rounded-t-3xl mb-6`}>
                <div className='flex items-center gap-4'>
                  <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <i className={`ri ${category.icon} text-2xl`} />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                      {t(category.title)}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {category.items.length} {t('skills.tools')}
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 items-start'>
                {category.items.map((tool) => (
                  <Link
                    key={tool.id}
                    to='/skill'
                    className='flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md hover:scale-105 transition-all duration-200'
                    title={tool.name}
                  >
                    {renderToolIcon(tool)}
                    <span className='text-sm font-semibold text-gray-800 dark:text-gray-200 text-center whitespace-nowrap'>
                      {tool.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStackCards
