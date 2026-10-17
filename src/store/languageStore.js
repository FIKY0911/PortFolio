import { create } from 'zustand'
import i18n from '../i18n'

export const useLanguageStore = create((set) => ({
  language: i18n.language || 'id',
  
  setLanguage: (lang) => {
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (lang === 'en') {
        url.searchParams.set('lang', 'en')
      } else {
        url.searchParams.delete('lang')
      }
      window.history.replaceState({}, '', url.pathname + (url.search || ''))
    }
    set({ language: lang })
  }
}))
