/**
 * ============================================================================
 * i18n/index.js - Internationalization Configuration
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. INTERNATIONALIZATION (i18n) PATTERN
 *    - i18n = internationalization (18 huruf antara i dan n)
 *    - Memungkinkan aplikasi support multiple languages
 *    - Centralized translation management
 *    - Runtime language switching tanpa reload
 * 
 * 2. i18next LIBRARY
 *    - Industry standard untuk i18n di React
 *    - Powerful features: pluralization, interpolation, nesting
 *    - Plugin system yang extensible
 *    - react-i18next: React bindings untuk i18next
 * 
 * 3. CONFIGURATION BREAKDOWN
 *    a. resources: Object berisi semua translations
 *       - Key: language code (id, en)
 *       - Value: translation object
 *    
 *    b. lng: Current language (dari localStorage)
 *       - Persist user preference
 *       - Default ke 'id' jika belum ada
 *    
 *    c. fallbackLng: Bahasa fallback jika translation tidak ada
 *       - Safety net untuk missing translations
 *    
 *    d. interpolation.escapeValue: false
 *       - React sudah escape by default
 *       - Tidak perlu double escaping
 * 
 * 4. LOCALSTORAGE PERSISTENCE
 *    - Simpan language preference di localStorage
 *    - Persist across browser sessions
 *    - Event listener untuk auto-save saat language change
 * 
 * 5. SIDE EFFECT IMPORT
 *    - File ini di-import di main.jsx sebagai side effect
 *    - Setup i18n sebelum app render
 *    - Export default untuk digunakan di komponen
 * 
 * BEST PRACTICES:
 * - Gunakan namespace untuk organize translations (optional)
 * - Consistent key naming convention (camelCase atau dot.notation)
 * - Fallback language harus complete (cover semua keys)
 * - Lazy load translations untuk large apps
 * 
 * TIPS UNTUK JUNIOR:
 * - Translation keys harus sama di semua language files
 * - Gunakan t() function di component untuk translate
 * - Test dengan multiple languages untuk catch missing keys
 * - Jangan hardcode text, selalu gunakan translation keys
 * 
 * USAGE EXAMPLE:
 * ```jsx
 * import { useTranslation } from 'react-i18next'
 * 
 * function MyComponent() {
 *   const { t, i18n } = useTranslation()
 *   
 *   return (
 *     <div>
 *       <h1>{t('hero.title')}</h1>
 *       <button onClick={() => i18n.changeLanguage('en')}>
 *         English
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import id from './locales/id.json'
import en from './locales/en.json'

// Resolusi bahasa awal: Prioritas URL query (?lang= / ?lng=) > localStorage > browser language > default 'id'
export const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    // 1. Cek parameter URL (memungkinkan crawling Google/Bing dan direct sharing rute bahasa)
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get('lang') || params.get('lng')
    if (urlLang && (urlLang === 'id' || urlLang === 'en')) {
      return urlLang
    }

    // 2. Cek preferensi tersimpan di localStorage
    const saved = localStorage.getItem('language')
    if (saved && (saved === 'id' || saved === 'en')) {
      return saved
    }

    // 3. Cek bahasa bawaan browser pengguna
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase()
    if (browserLang.startsWith('en')) {
      return 'en'
    }
  }

  // 4. Default bahasa Indonesia
  return 'id'
}

const initialLanguage = getInitialLanguage()

// Initialize i18next dengan react-i18next plugin
i18n.use(initReactI18next).init({
  // Translation resources untuk setiap bahasa
  resources: {
    id: { translation: id }, // Bahasa Indonesia
    en: { translation: en }, // English
  },
  
  // Current language (dari URL param, localStorage, browser, atau default)
  lng: initialLanguage,
  
  // Fallback language jika translation tidak ditemukan
  fallbackLng: 'id',
  
  // Interpolation settings
  interpolation: {
    escapeValue: false, // React sudah escape by default
  },
})

// Set initial document language
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage
}

// Event listener: Save language ke localStorage saat berubah dan sinkronisasi <html lang="...">
// Ini memastikan preference user persist across sessions dan SEO / browser accessibility akurat
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
})

export default i18n
