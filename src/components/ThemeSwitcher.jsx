import { useThemeStore } from '../store/themeStore'

const ThemeSwitcher = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center justify-center w-10 h-10 rounded-lg border
        border-gray-200 bg-white hover:bg-gray-100 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 focus:ring-offset-gray-900' : ''}
        ${className}
      `}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <i 
          className={`
            ri-sun-line absolute inset-0 text-xl text-yellow-500 transition-all duration-300
            ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}
          `}
        />
        <i 
          className={`
            ri-moon-line absolute inset-0 text-xl text-gray-700 transition-all duration-300
            ${darkMode ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `}
        />
      </div>
    </button>
  )
}

export const ThemeSwitcherMinimal = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ${className}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <i className="ri-sun-line text-xl text-yellow-400" />
      ) : (
        <i className="ri-moon-line text-xl text-gray-600" />
      )}
    </button>
  )
}

export const ThemeSwitcherWithLabel = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <button
      onClick={toggleDarkMode}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${className}`}
    >
      {darkMode ? (
        <i className="ri-sun-line text-xl text-yellow-400" />
      ) : (
        <i className="ri-moon-line text-xl text-gray-600" />
      )}
      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  )
}

export default ThemeSwitcher

