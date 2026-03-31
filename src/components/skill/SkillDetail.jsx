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

import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'

// Import gambar dari assets
import Html from '../../assets/tools/Html-tools.webp'
import Css from '../../assets/tools/Css-tools.webp'
import Nextjs from '../../assets/tools/next-js-tools.webp'
import TypeScript from '../../assets/tools/Typescript-tools.webp'
import Javascript from '../../assets/tools/JS-tools.webp'
import Clerk from '../../assets/tools/clrek-tools.webp'
import Tailwind from '../../assets/tools/tailwind-css-tools.webp'
import ReactLogo from '../../assets/tools/react-logo.webp'
import Button from '../Button'

// Mapping gambar berdasarkan key teknologi
// Key ini harus sesuai dengan key di file i18n (skillDetail.technologies.{key})
const techImages = {
  nextjs: Nextjs,
  typescript: TypeScript,
  clerk: Clerk,
  tailwind: Tailwind,
  html: Html,
  css: Css,
  javascript: Javascript,
  react: ReactLogo,
}

// URL situs resmi untuk setiap teknologi
const officialSites = {
  nextjs: 'https://nextjs.org',
  typescript: 'https://www.typescriptlang.org',
  clerk: 'https://clerk.com',
  tailwind: 'https://tailwindcss.com',
  html: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  css: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  react: 'https://react.dev',
}

/**
 * AnimatedSkillCard Component
 * ============================
 * Card individual untuk setiap teknologi dengan animasi fade-in.
 * 
 * Props:
 * - techKey: Key teknologi (nextjs, typescript, dll)
 * - index: Index untuk delay animasi
 * - t: Fungsi translate dari i18n
 * 
 * Fitur:
 * - Animasi fade-in saat card masuk viewport
 * - Delay animasi berdasarkan index (100ms per card)
 * - Menampilkan gambar, nama, tipe, deskripsi, dan fitur
 * - Link ke situs resmi teknologi
 */
const AnimatedSkillCard = ({ techKey, index, t }) => {
  // Hook untuk deteksi apakah card sudah terlihat di viewport
  const { ref, inView } = useInView({
    triggerOnce: true, // Animasi hanya sekali
    threshold: 0.1,    // Trigger saat 10% card terlihat
  })

  const animationDelay = `${index * 100}ms`
  // Ambil data teknologi dari file translasi berdasarkan techKey
  const tech = t(`skillDetail.technologies.${techKey}`, { returnObjects: true })

  return (
    <div
      ref={ref}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:shadow-gray-900/30 transition-all duration-300 ${
        inView ? 'animate__animated animate__fadeInUp' : ''
      }`}
      style={{ animationDelay }}
    >
      <div className='flex items-center gap-4 mb-4'>
        <img
          src={techImages[techKey]}
          alt={tech.name}
          className='w-12 h-12 rounded-lg object-contain'
        />
        <div>
          <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
            {tech.name}
          </h2>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            {tech.type}
          </span>
        </div>
      </div>

      <p className='text-gray-700 dark:text-gray-300 mb-4 leading-relaxed'>
        {tech.description}
      </p>

      <div className='mb-4'>
        <h3 className='font-semibold text-gray-800 dark:text-white mb-2'>
          {t('skillDetail.features')}
        </h3>
        <ul className='list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 text-sm'>
          {tech.features.map((feature, id) => (
            <li key={id}>{feature}</li>
          ))}
        </ul>
      </div>

      <a
        href={officialSites[techKey]}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 text-sm font-medium transition-colors'
      >
        {t('skillDetail.visitSite')}
      </a>
    </div>
  )
}

/**
 * SkillDetail Component (Main)
 * =============================
 * Komponen utama halaman detail skill.
 * Menampilkan grid semua teknologi yang dikuasai.
 */
const SkillDetail = () => {
  const { t } = useTranslation()

  // Array key teknologi yang akan ditampilkan
  // Urutan di sini menentukan urutan tampilan di halaman
  const techKeys = ['nextjs', 'typescript', 'clerk', 'tailwind', 'html', 'css', 'javascript', 'react']

  return (
    <div className='py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4'>
            {t('skillDetail.title')}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            {t('skillDetail.description')}
          </p>
        </div>

        {/* Grid Detail */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {techKeys.map((techKey, index) => (
            <AnimatedSkillCard key={techKey} techKey={techKey} index={index} t={t} />
          ))}
        </div>

        {/* Back Button */}
        <div className='mt-12 text-center'>
          <Link to='/'>
            <Button>{t('skillDetail.back')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SkillDetail
