/**
 * ThemeSwitcher.jsx
 * =================
 * Komponen tombol untuk toggle antara light dan dark mode.
 * Menggunakan style yang mirip dean shadcn/ui.
 * 
 * PENJELASAN:
 * -----------
 * 1. useTheme() - Hook untuk mengakses state tema dari ThemeContext.
 * 
 * 2. Button styling - Menggunakan Tailwind CSS dengan style minimalis
 *    seperti shadcn/ui (rounded, subtle hover effect, clean icons).
 * 
 * 3. Icons - Menggunakan Remix Icon (ri-sun-line dan ri-moon-line)
 *    yang sudah terinstall di project.
 * 
 * 4. Transisi - Smooth transition untuk icon dan background saat hover.
 * 
 * 5. Accessibility - Menyertakan aria-label untuk screen readers.
 */

import { useTheme } from './context/ThemeContext'

/**
 * ThemeSwitcher Component
 * -----------------------
 * Tombol toggle untuk switch antara light dan dark mode.
 * 
 * FITUR:
 * - Icon berubah sesuai tema (sun untuk light, moon untuk dark)
 * - Smooth transition animation
 * - Hover effect yang subtle
 * - Accessible dengan aria-label
 * 
 * CARA PENGGUNAAN:
 * <ThemeSwitcher />
 * 
 * Atau dengan custom className:
 * <ThemeSwitcher className="ml-4" />
 * 
 * @param {Object} props - Props component
 * @param {string} props.className - Additional CSS classes (optional)
 */
const ThemeSwitcher = ({ className = '' }) => {
  // Ambil state dan fungsi dari ThemeContext
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative
        inline-flex
        items-center
        justify-center
        w-10
        h-10
        rounded-lg
        border
        border-gray-200
        bg-white
        hover:bg-gray-100
        transition-all
        duration-200
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        ${isDark ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 focus:ring-offset-gray-900' : ''}
        ${className}
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Container untuk icons dengan animasi */}
      <div className="relative w-5 h-5">
        {/* Sun Icon - tampil saat dark mode (untuk switch ke light) */}
        <i 
          className={`
            ri-sun-line
            absolute
            inset-0
            text-xl
            text-yellow-500
            transition-all
            duration-300
            ${isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
            }
          `}
        />
        
        {/* Moon Icon - tampil saat light mode (untuk switch ke dark) */}
        <i 
          className={`
            ri-moon-line
            absolute
            inset-0
            text-xl
            text-gray-700
            transition-all
            duration-300
            ${isDark 
              ? 'opacity-0 -rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
            }
          `}
        />
      </div>
    </button>
  )
}

/**
 * ThemeSwitcherMinimal Component
 * ------------------------------
 * Versi minimal tanpa border, cocok untuk navbar yang sudah punya background.
 */
export const ThemeSwitcherMinimal = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2
        rounded-full
        transition-colors
        duration-200
        ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
        ${className}
      `}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <i className="ri-sun-line text-xl text-yellow-400" />
      ) : (
        <i className="ri-moon-line text-xl text-gray-600" />
      )}
    </button>
  )
}

/**
 * ThemeSwitcherWithLabel Component
 * --------------------------------
 * Versi dengan label text, cocok untuk settings page atau menu.
 */
export const ThemeSwitcherWithLabel = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex
        items-center
        gap-3
        px-4
        py-2
        rounded-lg
        transition-colors
        duration-200
        ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
        ${className}
      `}
    >
      {isDark ? (
        <i className="ri-sun-line text-xl text-yellow-400" />
      ) : (
        <i className="ri-moon-line text-xl text-gray-600" />
      )}
      <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  )
}

export default ThemeSwitcher

