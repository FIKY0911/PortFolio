/**
 * SkillDetail.jsx
 * ===============
 * Halaman detail yang menampilkan semua teknologi/tools yang dikuasai.
 * Diakses melalui route /skill dari navbar.
 * 
 * FITUR:
 * - Menampilkan 8 teknologi dalam grid layout (2 kolom di desktop)
 * - Setiap card menampilkan: nama, tipe, deskripsi, fitur unggulan, dan link ke situs resmi
 * - Animasi fade-in saat scroll menggunakan react-intersection-observer
 * - Mendukung multi-bahasa (ID/EN) menggunakan i18n
 * - Data teknologi diambil dari file translasi (id.json/en.json)
 * 
 * STRUKTUR DATA:
 * - techImages: Mapping key teknologi ke file gambar
 * - officialSites: Mapping key teknologi ke URL situs resmi
 * - Data detail (nama, tipe, deskripsi, fitur) ada di file i18n/locales
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import CategorySlider from '../ui/CategorySlider'

// Import gambar dari assets
import Nextjs from '../../assets/tools/next-js-tools_compressed.webp'
import TypeScript from '../../assets/tools/Typescript-tools_compressed.webp'
import Javascript from '../../assets/tools/JS-tools_compressed.webp'
import Clerk from '../../assets/tools/clrek-tools_compressed.webp'
import Tailwind from '../../assets/tools/tailwind-css-tools_compressed.webp'
import ReactLogo from '../../assets/tools/react-logo_compressed.webp'
import Button from '../Button'

// Mapping gambar berdasarkan key teknologi
const techImages = {
  nextjs: Nextjs,
  typescript: TypeScript,
  clerk: Clerk,
  tailwind: Tailwind,
  javascript: Javascript,
  react: ReactLogo,
  nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
  express: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
  mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg',
  prisma: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
  postman: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',
  sanity: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sanity/sanity-original.svg',
  vercel: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
}

// Icon fallback untuk teknologi backend, tools, dan AI
const techIcons = {
  nodejs: { icon: 'ri-nodejs-line', color: 'text-emerald-500' },
  express: { icon: 'ri-server-line', color: 'text-gray-700 dark:text-gray-300' },
  postgresql: { icon: 'ri-database-2-line', color: 'text-blue-500' },
  mysql: { icon: 'ri-database-line', color: 'text-amber-500' },
  prisma: { icon: 'ri-stack-line', color: 'text-teal-500' },
  restapi: { icon: 'ri-swap-line', color: 'text-cyan-500' },
  aiagent: { icon: 'ri-robot-2-line', color: 'text-violet-500' },
  git: { icon: 'ri-github-fill', color: 'text-gray-800 dark:text-gray-200' },
  docker: { icon: 'ri-box-3-line', color: 'text-sky-500' },
  postman: { icon: 'ri-send-plane-line', color: 'text-orange-500' },
  sanity: { icon: 'ri-file-cloud-line', color: 'text-red-500' },
  vercel: { icon: 'ri-cloud-line', color: 'text-gray-900 dark:text-white' },
}

// URL situs resmi untuk setiap teknologi
const officialSites = {
  react: 'https://react.dev',
  nextjs: 'https://nextjs.org',
  typescript: 'https://www.typescriptlang.org',
  javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  tailwind: 'https://tailwindcss.com',
  nodejs: 'https://nodejs.org',
  express: 'https://expressjs.com',
  postgresql: 'https://www.postgresql.org',
  mysql: 'https://www.mysql.com',
  prisma: 'https://www.prisma.io',
  restapi: 'https://restfulapi.net',
  aiagent: 'https://github.com/mohamadfiky',
  git: 'https://git-scm.com',
  docker: 'https://www.docker.com',
  postman: 'https://www.postman.com',
  sanity: 'https://www.sanity.io',
  clerk: 'https://clerk.com',
  vercel: 'https://vercel.com',
}

// Metadata kategori teknologi
const TECH_CATALOG = [
  { key: 'react', category: 'frontend' },
  { key: 'nextjs', category: 'frontend' },
  { key: 'typescript', category: 'frontend' },
  { key: 'javascript', category: 'frontend' },
  { key: 'tailwind', category: 'frontend' },
  { key: 'nodejs', category: 'backend' },
  { key: 'express', category: 'backend' },
  { key: 'postgresql', category: 'backend' },
  { key: 'mysql', category: 'backend' },
  { key: 'prisma', category: 'backend' },
  { key: 'restapi', category: 'backend' },
  { key: 'aiagent', category: 'ai' },
  { key: 'git', category: 'tools' },
  { key: 'docker', category: 'tools' },
  { key: 'postman', category: 'tools' },
  { key: 'sanity', category: 'tools' },
  { key: 'clerk', category: 'tools' },
  { key: 'vercel', category: 'tools' },
]

const AnimatedSkillCard = ({ techKey, index, t }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const animationDelay = `${(index % 6) * 80}ms`
  const tech = t(`skillDetail.technologies.${techKey}`, { returnObjects: true }) || {
    name: techKey,
    type: 'Technology',
    description: '',
    features: [],
  }

  const iconInfo = techIcons[techKey]

  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl dark:shadow-gray-900/40 transition-all duration-300 flex flex-col justify-between ${
        inView ? 'animate__animated animate__fadeInUp' : 'opacity-0'
      }`}
      style={{ animationDelay }}
    >
      <div>
        <div className='flex items-center gap-4 mb-4'>
          {techImages[techKey] ? (
            <img
              src={techImages[techKey]}
              alt={tech.name || techKey}
              width={48}
              height={48}
              loading="lazy"
              className={`w-12 h-12 rounded-xl object-contain ${['express', 'vercel'].includes(techKey) ? 'dark:brightness-0 dark:invert' : ''}`}
            />
          ) : (
            <div className='w-12 h-12 bg-gray-100 dark:bg-gray-700/80 rounded-2xl flex items-center justify-center shadow-inner'>
              <i className={`${iconInfo?.icon || 'ri-code-line'} ${iconInfo?.color || 'text-cyan-500'} text-2xl`} />
            </div>
          )}
          <div>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
              {tech.name || techKey}
            </h2>
            <span className='text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800'>
              {tech.type || 'Tech'}
            </span>
          </div>
        </div>

        <p className='text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed'>
          {tech.description}
        </p>

        {Array.isArray(tech.features) && tech.features.length > 0 && (
          <div className='mb-4'>
            <h3 className='font-semibold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wider'>
              {t('skillDetail.features', 'Fitur Utama:')}
            </h3>
            <ul className='space-y-1.5 text-gray-600 dark:text-gray-400 text-xs'>
              {tech.features.map((feature, id) => (
                <li key={id} className='flex items-start gap-1.5'>
                  <i className='ri-check-line text-emerald-500 font-bold shrink-0 mt-0.5' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className='pt-4 border-t border-gray-100 dark:border-gray-700'>
        <a
          href={officialSites[techKey] || '#'}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 text-xs font-semibold transition-colors'
        >
          <span>{t('skillDetail.visitSite', 'Kunjungi Situs Resmi →')}</span>
        </a>
      </div>
    </div>
  )
}

const SkillDetail = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')

  const filterTabs = [
    { key: 'all', labelKey: 'skills.allCategories', defaultLabel: 'Semua' },
    { key: 'frontend', labelKey: 'skills.frontend', defaultLabel: 'Frontend' },
    { key: 'backend', labelKey: 'skills.backend', defaultLabel: 'Backend & DB' },
    { key: 'ai', labelKey: 'skills.ai', defaultLabel: 'AI Engineering' },
    { key: 'tools', labelKey: 'skills.toolsAndDevOps', defaultLabel: 'Tools & DevOps' },
  ]

  const displayedTechs = filter === 'all'
    ? TECH_CATALOG
    : TECH_CATALOG.filter(item => item.category === filter)

  return (
    <div className='py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold mb-4 ring-1 ring-cyan-300 dark:ring-cyan-700">
            <i className="ri-award-line" />
            <span>{t('skillDetail.badge', 'Verified Technical Competencies')}</span>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent mb-4'>
            {t('skillDetail.title', 'Spesifikasi & Detail Teknologi')}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed'>
            {t('skillDetail.description', 'Dokumentasi mendalam mengenai setiap teknologi, framework, basis data, dan rekayasa AI yang saya terapkan.')}
          </p>
        </div>

        {/* Filter Navigation */}
        <CategorySlider
          activeKey={filter}
          containerClassName="mb-10 max-w-4xl mx-auto"
          ariaLabel={t('skills.skillFilterCategories', 'Filter Kategori Skill')}
        >
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              data-key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                filter === tab.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {t(tab.labelKey, tab.defaultLabel)}
            </button>
          ))}
        </CategorySlider>

        {/* Grid Detail */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {displayedTechs.map((item, index) => (
            <AnimatedSkillCard
              key={item.key}
              techKey={item.key}
              index={index}
              t={t}
            />
          ))}
        </div>

        {/* Back Button */}
        <div className='mt-16 text-center'>
          <Link to='/'>
            <Button>{t('skillDetail.back', 'Kembali ke Beranda')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SkillDetail
