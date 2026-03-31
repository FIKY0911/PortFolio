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

// Get saved language dari localStorage, default ke 'id'
const savedLanguage = localStorage.getItem('language') || 'id'

// Initialize i18next dengan react-i18next plugin
i18n.use(initReactI18next).init({
  // Translation resources untuk setiap bahasa
  resources: {
    id: { translation: id }, // Bahasa Indonesia
    en: { translation: en }, // English
  },
  
  // Current language (dari localStorage atau default)
  lng: savedLanguage,
  
  // Fallback language jika translation tidak ditemukan
  fallbackLng: 'id',
  
  // Interpolation settings
  interpolation: {
    escapeValue: false, // React sudah escape by default
  },
})

// Event listener: Save language ke localStorage saat berubah
// Ini memastikan preference user persist across sessions
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
