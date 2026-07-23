import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDataStore } from '../../../store/dataStore'

// Level badge styling
const levelConfig = {
  Advanced:     { label: { id: 'Mahir',     en: 'Advanced'     }, class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700' },
  Intermediate: { label: { id: 'Menengah',  en: 'Intermediate' }, class: 'bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300  ring-1 ring-amber-300  dark:ring-amber-700'  },
  Beginner:     { label: { id: 'Pemula',    en: 'Beginner'     }, class: 'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300   ring-1 ring-blue-300   dark:ring-blue-700'   },
}

// Category definitions
const CATEGORIES = [
  {
    key: 'languages',
    titleKey: 'skills.languages',
    icon: 'ri-code-s-slash-line',
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'hover:shadow-blue-500/20',
    names: ['Html', 'Css', 'Javascript', 'TypeScript'],
  },
  {
    key: 'frameworks',
    titleKey: 'skills.frameworks',
    icon: 'ri-layout-4-line',
    gradient: 'from-violet-500 to-pink-500',
    shadow: 'hover:shadow-violet-500/20',
    names: ['Nextjs', 'Tailwind Css', 'Clerk', 'React'],
  },
  {
    key: 'versionControl',
    titleKey: 'skills.versionControl',
    icon: 'ri-git-branch-line',
    gradient: 'from-orange-500 to-red-400',
    shadow: 'hover:shadow-orange-500/20',
    names: ['Git'],
  },
]

// Single tool icon card
const ToolItem = ({ tool, lang }) => {
  const cfg = levelConfig[tool.keterangan] || levelConfig.Beginner
  const badgeLabel = cfg.label[lang] ?? tool.keterangan

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className='flex flex-col items-center gap-2 p-3 rounded-2xl
                 bg-gray-50 dark:bg-gray-700/50
                 border border-gray-100 dark:border-gray-700
                 hover:border-blue-400/50 dark:hover:border-blue-500/40
                 hover:bg-white dark:hover:bg-gray-700
                 transition-colors duration-200 w-20'
    >
      {tool.image_url ? (
        <img
          src={tool.image_url}
          alt={tool.name}
          className='w-10 h-10 object-contain drop-shadow-sm'
          loading='lazy'
        />
      ) : (
        <div className='w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center'>
          <i className='ri-code-line text-gray-400 ri-lg' />
        </div>
      )}

      <span className='text-[11px] font-semibold text-gray-800 dark:text-gray-200 text-center leading-tight'>
        {tool.name}
      </span>

      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.class}`}>
        {badgeLabel}
      </span>
    </motion.div>
  )
}

// One category card
const CategoryCard = ({ category, tools, index }) => {
  const { t, i18n } = useTranslation()
  const items = tools.filter(tool => category.names.includes(tool.name))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`
        group relative bg-white dark:bg-gray-800
        rounded-3xl p-6
        border border-gray-100 dark:border-gray-700
        shadow-lg hover:shadow-2xl ${category.shadow}
        transition-all duration-300
      `}
    >
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r ${category.gradient}`} />

      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className={`w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} shadow-md`}>
          <i className={`${category.icon} ri-lg text-white`} />
        </div>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white tracking-tight'>
          {t(category.titleKey)}
        </h3>
        <span className='ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'>
          {items.length} tools
        </span>
      </div>

      {/* Tools grid — 2 kolom */}
      <div className='grid grid-cols-2 gap-3 justify-items-center'>
        {items.length > 0 ? (
          items.map(tool => (
            <ToolItem key={tool.id} tool={tool} lang={i18n.language} />
          ))
        ) : (
          <p className='text-sm text-gray-400 dark:text-gray-500 py-4'>{t('skills.noSkills')}</p>
        )}
      </div>
    </motion.div>
  )
}

// Main export
const Card = () => {
  const tools = useDataStore((state) => state.tools)

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {CATEGORIES.map((category, index) => (
        <CategoryCard
          key={category.key}
          category={category}
          tools={tools}
          index={index}
        />
      ))}
    </div>
  )
}

export default Card
