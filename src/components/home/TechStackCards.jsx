import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// Import assets
import Javascript from '../../assets/tools/JS-tools_compressed.webp'
import Nextjs from '../../assets/tools/next-js-tools_compressed.webp'
import TypeScript from '../../assets/tools/Typescript-tools_compressed.webp'
import Clerk from '../../assets/tools/clrek-tools_compressed.webp'
import Tailwind from '../../assets/tools/tailwind-css-tools_compressed.webp'
import ReactLogo from '../../assets/tools/react-logo_compressed.webp'

// Comprehensive tools database broken down per specific engineering domain
const COMPREHENSIVE_TOOLS = [
  // --- FRONTEND DEVELOPMENT ---
  { id: 1, name: 'React.js', category: 'frontend', image_url: ReactLogo, icon: 'ri-reactjs-line', level: 'Advanced' },
  { id: 2, name: 'Next.js', category: 'frontend', image_url: Nextjs, icon: 'ri-nextjs-line', level: 'Intermediate' },
  { id: 3, name: 'TypeScript', category: 'frontend', image_url: TypeScript, icon: 'ri-javascript-line', level: 'Intermediate' },
  { id: 4, name: 'JavaScript (ES6+)', category: 'frontend', image_url: Javascript, icon: 'ri-javascript-line', level: 'Advanced' },
  { id: 5, name: 'Tailwind CSS', category: 'frontend', image_url: Tailwind, icon: 'ri-css3-line', level: 'Advanced' },

  // --- BACKEND & DATABASE ---
  { id: 8, name: 'Node.js', category: 'backend', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', icon: 'ri-nodejs-line', iconColor: 'text-emerald-500', level: 'Intermediate' },
  { id: 9, name: 'Express.js', category: 'backend', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', icon: 'ri-server-line', iconColor: 'text-gray-700 dark:text-gray-300', level: 'Intermediate' },
  { id: 10, name: 'PostgreSQL', category: 'backend', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', icon: 'ri-database-2-line', iconColor: 'text-blue-500', level: 'Intermediate' },
  { id: 11, name: 'MySQL', category: 'backend', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', icon: 'ri-database-line', iconColor: 'text-amber-500', level: 'Intermediate' },
  { id: 12, name: 'Prisma ORM', category: 'backend', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg', icon: 'ri-stack-line', iconColor: 'text-teal-500', level: 'Intermediate' },
  { id: 13, name: 'RESTful APIs', category: 'backend', icon: 'ri-swap-line', iconColor: 'text-cyan-500', level: 'Advanced' },

  // --- AI-ASSISTED ENGINEERING ---
  { id: 14, name: 'AI Agent Integration', category: 'ai', icon: 'ri-robot-2-line', iconColor: 'text-violet-500', level: 'Intermediate' },
  { id: 15, name: 'AI Code Generation', category: 'ai', icon: 'ri-sparkling-2-line', iconColor: 'text-purple-500', level: 'Advanced' },
  { id: 16, name: 'Prompt Refactoring', category: 'ai', icon: 'ri-brain-line', iconColor: 'text-pink-500', level: 'Advanced' },

  // --- DEVELOPER TOOLS & PLATFORMS ---
  { id: 17, name: 'Git & GitHub', category: 'tools', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', icon: 'ri-github-fill', iconColor: 'text-gray-800 dark:text-gray-200', level: 'Advanced' },
  { id: 18, name: 'Clerk Auth', category: 'tools', image_url: Clerk, icon: 'ri-shield-keyhole-line', level: 'Intermediate' },
  { id: 19, name: 'Docker', category: 'tools', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', icon: 'ri-box-3-line', iconColor: 'text-sky-500', level: 'Beginner' },
  { id: 20, name: 'Postman', category: 'tools', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg', icon: 'ri-send-plane-line', iconColor: 'text-orange-500', level: 'Intermediate' },
  { id: 21, name: 'Sanity CMS', category: 'tools', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sanity/sanity-original.svg', icon: 'ri-file-cloud-line', iconColor: 'text-red-500', level: 'Intermediate' },
  { id: 22, name: 'Vercel', category: 'tools', image_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', icon: 'ri-cloud-line', iconColor: 'text-gray-900 dark:text-gray-100', level: 'Advanced' },

  // --- ARCHITECTURE & SYSTEM DESIGN ---
  { id: 23, name: 'Modular Architecture', category: 'architecture', icon: 'ri-node-tree', iconColor: 'text-rose-500', level: 'Intermediate' },
  { id: 24, name: 'Separation of Concerns', category: 'architecture', icon: 'ri-layout-masonry-line', iconColor: 'text-indigo-500', level: 'Advanced' },
]

const CATEGORY_DEFINITIONS = [
  {
    key: 'frontend',
    titleKey: 'skills.frontend',
    defaultTitle: 'Frontend Development',
    descKey: 'skills.frontendDesc',
    defaultDesc: 'Modern responsive web architecture & client-side rendering',
    icon: 'ri-layout-3-line',
    gradient: 'from-blue-500 to-cyan-500',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700',
    bgHeader: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30'
  },
  {
    key: 'backend',
    titleKey: 'skills.backend',
    defaultTitle: 'Backend & Database',
    descKey: 'skills.backendDesc',
    defaultDesc: 'Scalable server APIs, relational data modeling & ORM',
    icon: 'ri-server-line',
    gradient: 'from-emerald-500 to-teal-500',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700',
    bgHeader: 'from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30'
  },
  {
    key: 'ai',
    titleKey: 'skills.ai',
    defaultTitle: 'AI-Assisted Engineering',
    descKey: 'skills.aiDesc',
    defaultDesc: 'Autonomous agents, prompt refactoring & AI-driven delivery',
    icon: 'ri-robot-2-line',
    gradient: 'from-violet-500 to-purple-500',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 ring-1 ring-purple-300 dark:ring-purple-700',
    bgHeader: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30'
  },
  {
    key: 'tools',
    titleKey: 'skills.toolsAndDevOps',
    defaultTitle: 'Developer Tools & Platforms',
    descKey: 'skills.toolsDesc',
    defaultDesc: 'Version control, API testing, auth & cloud deployment',
    icon: 'ri-tools-line',
    gradient: 'from-amber-500 to-orange-500',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-700',
    bgHeader: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30'
  },
  {
    key: 'architecture',
    titleKey: 'skills.architecture',
    defaultTitle: 'Architecture & System Design',
    descKey: 'skills.architectureDesc',
    defaultDesc: 'Modular boundaries, clean separation of concerns & system flows',
    icon: 'ri-node-tree',
    gradient: 'from-rose-500 to-pink-500',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 ring-1 ring-rose-300 dark:ring-rose-700',
    bgHeader: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30'
  }
]

const levelBadgeConfig = {
  Advanced: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Intermediate: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Beginner: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
}

const TechStackCards = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('all')

  const filteredCategories = activeTab === 'all'
    ? CATEGORY_DEFINITIONS
    : CATEGORY_DEFINITIONS.filter(c => c.key === activeTab)

  const renderToolIcon = (tool) => {
    if (tool.image_url) {
      const isMonochrome = tool.name === 'Express.js' || tool.name === 'Vercel'
      return (
        <img
          src={tool.image_url}
          alt={tool.name}
          width={40}
          height={40}
          loading="lazy"
          className={`w-10 h-10 object-contain drop-shadow-sm ${isMonochrome ? 'dark:brightness-0 dark:invert' : ''}`}
        />
      )
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-inner">
        <i className={`${tool.icon || 'ri-code-line'} ${tool.iconColor || 'text-cyan-500'} text-xl`} />
      </div>
    )
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent mb-4">
            {t('skills.techStack', 'Tech Stack & Spesialisasi')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('skills.techStackDesc', 'Klasifikasi teknologi terperinci: dari Frontend, Backend & Database, AI Engineering, hingga Tools DevOps.')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {t('skills.allCategories', 'Semua Kategori')} ({COMPREHENSIVE_TOOLS.length})
          </button>
          {CATEGORY_DEFINITIONS.map(cat => {
            const count = COMPREHENSIVE_TOOLS.filter(tool => tool.category === cat.key).length
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === cat.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <i className={`${cat.icon} text-sm`} />
                <span>{t(cat.titleKey, cat.defaultTitle)}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">{count}</span>
              </button>
            )
          })}
        </div>

        {/* Categorized Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => {
            const items = COMPREHENSIVE_TOOLS.filter(tool => tool.category === category.key)

            return (
              <div
                key={category.key}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Header Banner */}
                <div className={`bg-gradient-to-br ${category.bgHeader} p-6 border-b border-gray-100 dark:border-gray-700/60`}>
                  <div className="flex items-center gap-3.5 mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/10`}>
                      <i className={`${category.icon} text-2xl`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        {t(category.titleKey, category.defaultTitle)}
                      </h3>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${category.badgeClass}`}>
                        {items.length} {t('skills.tools', 'Tools')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-2">
                    {t(category.descKey, category.defaultDesc)}
                  </p>
                </div>

                {/* Items Grid */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3">
                    {items.map((tool) => (
                      <Link
                        key={tool.id}
                        to="/skill"
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md hover:scale-[1.03] border border-gray-100 dark:border-gray-700 transition-all duration-200 group/tool"
                        title={tool.name}
                      >
                        {renderToolIcon(tool)}
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 text-center leading-snug line-clamp-1">
                          {tool.name}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${levelBadgeConfig[tool.level] || levelBadgeConfig.Beginner}`}>
                          {tool.level}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-5 mt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('skills.viewDetails', 'Eksplorasi spesifikasi')}
                    </span>
                    <Link
                      to="/skill"
                      className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Detail</span>
                      <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TechStackCards
