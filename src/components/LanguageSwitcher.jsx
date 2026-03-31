import { useTranslation } from 'react-i18next'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setLanguage, selectLanguage } from '../store/slices/languageSlice'

/**
 * LanguageSwitcher Component
 * ==========================
 * Tombol toggle untuk switch antara Indonesia dan English
 * Menggunakan Redux untuk state management
 * 
 * FEATURES:
 * - Redux state management
 * - Sync dengan i18next
 * - Persist to localStorage
 * - Smooth transitions
 */
const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const currentLang = useAppSelector(selectLanguage)

  const toggleLanguage = () => {
    const newLang = currentLang === 'id' ? 'en' : 'id'
    
    // Update Redux state
    dispatch(setLanguage(newLang))
    
    // Update i18next
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`
        relative inline-flex items-center justify-center
        px-3 py-2 rounded-lg border
        border-gray-200 bg-white hover:bg-gray-100
        dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${className}
      `}
      aria-label={currentLang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
      title={currentLang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
    >
      <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>
        {currentLang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
      </span>
    </button>
  )
}

/**
 * LanguageSwitcherMinimal - Versi minimal tanpa border
 */
export const LanguageSwitcherMinimal = ({ className = '' }) => {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const currentLang = useAppSelector(selectLanguage)

  const toggleLanguage = () => {
    const newLang = currentLang === 'id' ? 'en' : 'id'
    dispatch(setLanguage(newLang))
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`
        p-2 rounded-full transition-colors duration-200
        hover:bg-gray-200 dark:hover:bg-gray-700
        ${className}
      `}
      aria-label={currentLang === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
    >
      <span className='text-lg'>{currentLang === 'id' ? '🇮🇩' : '🇬🇧'}</span>
    </button>
  )
}

export default LanguageSwitcher
