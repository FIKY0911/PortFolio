import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: localStorage.getItem('theme') === 'dark' || 
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
      
      toggleDarkMode: () => set((state) => {
        const nextMode = !state.darkMode
        if (nextMode) {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        }
        return { darkMode: nextMode }
      }),
      
      setDarkMode: (isDark) => {
        if (isDark) {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        }
        set({ darkMode: isDark })
      }
    }),
    {
      name: 'theme-storage',
    }
  )
)
