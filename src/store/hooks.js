/**
 * ============================================================================
 * hooks.js - Custom Redux Hooks
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. TYPED HOOKS
 *    - Pre-typed useDispatch dan useSelector
 *    - Better TypeScript support (jika pakai TS)
 *    - Consistent usage across app
 * 
 * 2. CUSTOM HOOKS PATTERN
 *    - Encapsulate Redux logic
 *    - Reusable across components
 *    - Easier to test
 *    - Better abstraction
 * 
 * 3. BENEFITS
 *    - No need to import useDispatch/useSelector everywhere
 *    - Centralized Redux logic
 *    - Easy to add middleware logic
 *    - Better developer experience
 * 
 * USAGE:
 * ```js
 * import { useAppDispatch, useAppSelector } from './store/hooks'
 * 
 * const dispatch = useAppDispatch()
 * const theme = useAppSelector(state => state.theme.mode)
 * ```
 */

import { useDispatch, useSelector } from 'react-redux'

/**
 * Use App Dispatch
 * ================
 * Pre-typed useDispatch hook
 * 
 * USAGE:
 * const dispatch = useAppDispatch()
 * dispatch(toggleTheme())
 */
export const useAppDispatch = () => useDispatch()

/**
 * Use App Selector
 * ================
 * Pre-typed useSelector hook
 * 
 * USAGE:
 * const theme = useAppSelector(state => state.theme.mode)
 */
export const useAppSelector = useSelector

/**
 * Use Theme
 * =========
 * Custom hook untuk theme management
 * 
 * RETURNS:
 * - theme: Current theme ('light' or 'dark')
 * - isDark: Boolean dark mode check
 * - setTheme: Function to set specific theme
 * - toggleTheme: Function to toggle theme
 */
export const useThemeRedux = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.theme.mode)
  const isDark = theme === 'dark'
  
  return {
    theme,
    isDark,
    setTheme: (newTheme) => dispatch({ type: 'theme/setTheme', payload: newTheme }),
    toggleTheme: () => dispatch({ type: 'theme/toggleTheme' }),
  }
}

/**
 * Use Language
 * ============
 * Custom hook untuk language management
 * 
 * RETURNS:
 * - language: Current language ('id' or 'en')
 * - loading: Loading state
 * - error: Error message
 * - changeLanguage: Function to change language
 */
export const useLanguageRedux = () => {
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.language.current)
  const loading = useAppSelector((state) => state.language.loading)
  const error = useAppSelector((state) => state.language.error)
  
  return {
    language,
    loading,
    error,
    changeLanguage: (lang) => dispatch({ type: 'language/setLanguage', payload: lang }),
  }
}

/**
 * Use Portfolio Data
 * ==================
 * Custom hook untuk portfolio data
 * 
 * RETURNS:
 * - profile: User profile data
 * - tools: List of tools/skills
 * - projects: List of projects
 * - filteredTools: Filtered tools based on level
 * - filteredProjects: Filtered projects based on tech
 * - filters: Current filter states
 * - setToolFilter: Function to filter tools
 * - setProjectFilter: Function to filter projects
 * - resetFilters: Function to reset all filters
 */
export const usePortfolioData = () => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.data.profile)
  const tools = useAppSelector((state) => state.data.tools)
  const projects = useAppSelector((state) => state.data.projects)
  const filters = useAppSelector((state) => state.data.filters)
  
  // Filtered data
  const filteredTools = useAppSelector((state) => {
    const { tools, filters } = state.data
    if (filters.toolLevel === 'all') return tools
    return tools.filter(tool => tool.keterangan === filters.toolLevel)
  })
  
  const filteredProjects = useAppSelector((state) => {
    const { projects, filters } = state.data
    if (filters.projectTech === 'all') return projects
    return projects.filter(project => project.tools.includes(filters.projectTech))
  })
  
  return {
    profile,
    tools,
    projects,
    filteredTools,
    filteredProjects,
    filters,
    setToolFilter: (level) => dispatch({ type: 'data/setToolFilter', payload: level }),
    setProjectFilter: (tech) => dispatch({ type: 'data/setProjectFilter', payload: tech }),
    resetFilters: () => dispatch({ type: 'data/resetFilters' }),
  }
}
