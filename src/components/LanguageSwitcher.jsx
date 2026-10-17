import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../store/languageStore'

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation()
  const { setLanguage } = useLanguageStore()
  const isEn = i18n.language?.startsWith('en')

  const toggleLanguage = () => {
    const newLang = isEn ? 'id' : 'en'
    setLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`
        relative inline-flex items-center justify-center px-3 py-2 rounded-lg border
        border-gray-200 bg-white hover:bg-gray-100
        dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900 ${className}
      `}
      aria-label={isEn ? 'Ganti ke Indonesia' : 'Switch to English'}
      title={isEn ? 'Ganti ke Indonesia' : 'Switch to English'}
    >
      <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
        {isEn ? '🇬🇧 EN' : '🇮🇩 ID'}
      </span>
    </button>
  )
}

export const LanguageSwitcherMinimal = ({ className = '' }) => {
  const { i18n } = useTranslation()
  const { setLanguage } = useLanguageStore()
  const isEn = i18n.language?.startsWith('en')

  const toggleLanguage = () => {
    const newLang = isEn ? 'id' : 'en'
    setLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
      aria-label={isEn ? 'Ganti ke Indonesia' : 'Switch to English'}
    >
      <span className='text-lg'>{isEn ? '🇬🇧' : '🇮🇩'}</span>
    </button>
  )
}

export default LanguageSwitcher
