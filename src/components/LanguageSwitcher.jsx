import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../store/languageStore'

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id'
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
      aria-label={language === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
      title={language === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
    >
      <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
        {language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
      </span>
    </button>
  )
}

export const LanguageSwitcherMinimal = ({ className = '' }) => {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id'
    setLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
      aria-label={language === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
    >
      <span className='text-lg'>{language === 'id' ? '🇮🇩' : '🇬🇧'}</span>
    </button>
  )
}

export default LanguageSwitcher
