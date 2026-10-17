import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDataStore } from '../../../store/dataStore'

// Import assets
import Javascript from '../../../assets/tools/JS-tools_compressed.webp'
import Nextjs from '../../../assets/tools/next-js-tools_compressed.webp'
import TypeScript from '../../../assets/tools/Typescript-tools_compressed.webp'
import Clerk from '../../../assets/tools/clrek-tools_compressed.webp'
import Tailwind from '../../../assets/tools/tailwind-css-tools_compressed.webp'
import ReactLogo from '../../../assets/tools/react-logo_compressed.webp'

// Level badge styling
const levelConfig = {
  Advanced:     { label: { id: 'Mahir',     en: 'Advanced'     }, class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700' },
  Intermediate: { label: { id: 'Menengah',  en: 'Intermediate' }, class: 'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300   ring-1 ring-blue-300   dark:ring-blue-700'   },
  Beginner:     { label: { id: 'Pemula',    en: 'Beginner'     }, class: 'bg-gray-100   text-gray-700   dark:bg-gray-800      dark:text-gray-300   ring-1 ring-gray-300   dark:ring-gray-700'   },
}

// Specialized category definitions matching CV
const CATEGORIES = [
  {
    key: 'frontend',
    titleKey: 'skills.frontend',
    icon: 'ri-layout-3-line',
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'hover:shadow-blue-500/20',
    names: ['React.js', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS'],
  },
  {
    key: 'backend',
    titleKey: 'skills.backend',
    icon: 'ri-server-line',
    gradient: 'from-emerald-500 to-teal-400',
    shadow: 'hover:shadow-emerald-500/20',
    names: ['Node.js', 'Express.js', 'PostgreSQL', 'MySQL', 'Prisma ORM', 'RESTful APIs'],
  },
  {
    key: 'ai',
    titleKey: 'skills.ai',
    icon: 'ri-robot-2-line',
    gradient: 'from-violet-500 to-purple-400',
    shadow: 'hover:shadow-violet-500/20',
    names: ['AI Agent Integration', 'AI Code Generation', 'Prompt Refactoring'],
  },
  {
    key: 'tools',
    titleKey: 'skills.toolsAndDevOps',
    icon: 'ri-tools-line',
    gradient: 'from-amber-500 to-orange-400',
    shadow: 'hover:shadow-amber-500/20',
    names: ['Git & GitHub', 'Clerk Auth', 'Docker', 'Postman', 'Sanity CMS', 'Vercel'],
  },
  {
    key: 'architecture',
    titleKey: 'skills.architecture',
    icon: 'ri-node-tree',
    gradient: 'from-rose-500 to-pink-400',
    shadow: 'hover:shadow-rose-500/20',
    names: ['Modular Architecture', 'Separation of Concerns'],
  },
]

// Fallback catalog of tools to ensure every category renders properly even if data store is partial
const FALLBACK_TOOLS = [
  { id: 101, name: 'React.js', image_url: ReactLogo, icon: 'ri-reactjs-line', keterangan: 'Advanced' },
  { id: 102, name: 'Next.js', image_url: Nextjs, icon: 'ri-nextjs-line', keterangan: 'Intermediate' },
  { id: 103, name: 'TypeScript', image_url: TypeScript, icon: 'ri-javascript-line', keterangan: 'Intermediate' },
  { id: 104, name: 'JavaScript (ES6+)', image_url: Javascript, icon: 'ri-javascript-line', keterangan: 'Advanced' },
  { id: 105, name: 'Tailwind CSS', image_url: Tailwind, icon: 'ri-css3-line', keterangan: 'Advanced' },
  { id: 108, name: 'Node.js', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', icon: 'ri-nodejs-line', keterangan: 'Intermediate' },
  { id: 109, name: 'Express.js', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', icon: 'ri-server-line', keterangan: 'Intermediate' },
  { id: 110, name: 'PostgreSQL', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', icon: 'ri-database-2-line', keterangan: 'Intermediate' },
  { id: 111, name: 'MySQL', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', icon: 'ri-database-line', keterangan: 'Intermediate' },
  { id: 112, name: 'Prisma ORM', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg', icon: 'ri-stack-line', keterangan: 'Intermediate' },
  { id: 113, name: 'RESTful APIs', image_url: null, icon: 'ri-swap-line', keterangan: 'Advanced' },
  { id: 114, name: 'AI Agent Integration', image_url: null, icon: 'ri-robot-2-line', keterangan: 'Intermediate' },
  { id: 115, name: 'AI Code Generation', image_url: null, icon: 'ri-sparkling-2-line', keterangan: 'Advanced' },
  { id: 116, name: 'Prompt Refactoring', image_url: null, icon: 'ri-brain-line', keterangan: 'Advanced' },
  { id: 117, name: 'Git & GitHub', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', icon: 'ri-github-fill', keterangan: 'Advanced' },
  { id: 118, name: 'Clerk Auth', image_url: Clerk, icon: 'ri-shield-keyhole-line', keterangan: 'Intermediate' },
  { id: 119, name: 'Docker', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', icon: 'ri-box-3-line', keterangan: 'Beginner' },
  { id: 120, name: 'Postman', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg', icon: 'ri-send-plane-line', keterangan: 'Intermediate' },
  { id: 121, name: 'Sanity CMS', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sanity/sanity-original.svg', icon: 'ri-file-cloud-line', keterangan: 'Intermediate' },
  { id: 122, name: 'Vercel', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', icon: 'ri-cloud-line', keterangan: 'Advanced' },
  { id: 123, name: 'Modular Architecture', image_url: null, icon: 'ri-node-tree', keterangan: 'Intermediate' },
  { id: 124, name: 'Separation of Concerns', image_url: null, icon: 'ri-layout-masonry-line', keterangan: 'Advanced' },
]

// Single tool icon card
const ToolItem = ({ tool, lang }) => {
  const cfg = levelConfig[tool.keterangan] || levelConfig.Beginner
  const badgeLabel = cfg.label[lang] ?? tool.keterangan
  const isMonochrome = tool.name?.toLowerCase().includes('express') || tool.name?.toLowerCase().includes('vercel')

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className='flex flex-col items-center gap-2 p-3 rounded-2xl
                 bg-gray-50 dark:bg-gray-700/50
                 border border-gray-100 dark:border-gray-700
                 hover:border-blue-400/50 dark:hover:border-blue-500/40
                 hover:bg-white dark:hover:bg-gray-700
                 transition-colors duration-200 w-24'
    >
      {tool.image_url ? (
        <img
          src={tool.image_url}
          alt={tool.name}
          width={40}
          height={40}
          className={`w-10 h-10 object-contain drop-shadow-sm ${isMonochrome ? 'dark:brightness-0 dark:invert' : ''}`}
          loading='lazy'
        />
      ) : (
        <div className='w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center'>
          <i className={`${tool.icon || 'ri-code-line'} text-blue-500 dark:text-cyan-400 ri-lg`} />
        </div>
      )}

      <span className='text-[11px] font-semibold text-gray-800 dark:text-gray-200 text-center leading-tight line-clamp-1'>
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
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        group relative bg-white dark:bg-gray-800
        rounded-3xl p-6
        border border-gray-100 dark:border-gray-700
        shadow-lg hover:shadow-2xl ${category.shadow}
        transition-all duration-300 flex flex-col justify-between
      `}
    >
      {/* Top accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r ${category.gradient}`} />

      {/* Header */}
      <div>
        <div className='flex items-center gap-3 mb-6'>
          <div className={`w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} shadow-md`}>
            <i className={`${category.icon} ri-lg text-white`} />
          </div>
          <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight'>
            {t(category.titleKey)}
          </h3>
          <span className='ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'>
            {items.length} tools
          </span>
        </div>

        {/* Tools grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3 justify-items-center'>
          {items.length > 0 ? (
            items.map(tool => (
              <ToolItem key={tool.id || tool.name} tool={tool} lang={i18n.language} />
            ))
          ) : (
            <p className='text-sm text-gray-400 dark:text-gray-500 py-4 col-span-2'>{t('skills.noSkills')}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Main export
const Card = () => {
  const storeTools = useDataStore((state) => state.tools) || []

  // Merge store tools with fallback catalog to guarantee full representation
  const mergedMap = new Map()
  FALLBACK_TOOLS.forEach(tool => mergedMap.set(tool.name, tool))
  storeTools.forEach(tool => mergedMap.set(tool.name, { ...mergedMap.get(tool.name), ...tool }))
  const combinedTools = Array.from(mergedMap.values())

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {CATEGORIES.map((category, index) => (
        <CategoryCard
          key={category.key}
          category={category}
          tools={combinedTools}
          index={index}
        />
      ))}
    </div>
  )
}

export default Card
