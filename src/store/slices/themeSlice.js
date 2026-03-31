/**
 * ============================================================================
 * themeSlice.js - Theme State Management
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. REDUX SLICE
 *    - createSlice: Generate actions & reducer
 *    - Automatic action creators
 *    - Immer.js untuk immutable updates
 *    - Less boilerplate code
 * 
 * 2. INITIAL STATE
 *    - Load dari localStorage
 *    - Fallback ke system preference
 *    - Persist across sessions
 * 
 * 3. REDUCERS
 *    - Pure functions
 *    - Immutable updates (handled by Immer)
 *    - Synchronous state changes
 * 
 * 4. ACTIONS
 *    - setTheme: Set specific theme
 *    - toggleTheme: Toggle between light/dark
 *    - Auto-generated action creators
 * 
 * 5. SELECTORS
 *    - selectTheme: Get current theme
 *    - selectIsDark: Boolean dark mode check
 *    - Memoized dengan reselect (optional)
 * 
 * BENEFITS:
 * - Centralized theme state
 * - No prop drilling
 * - Persist theme preference
 * - Easy to test
 */

import { createSlice } from '@reduxjs/toolkit'

/**
 * Get Initial Theme
 * =================
 * Priority: localStorage > system preference > 'light'
 */
const getInitialTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) return savedTheme
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * Theme Slice
 * ===========
 * Manage theme state (light/dark mode)
 */
const themeSlice = createSlice({
  name: 'theme',
  
  initialState: {
    mode: getInitialTheme(), // 'light' or 'dark'
  },
  
  reducers: {
    /**
     * Set Theme
     * =========
     * Set specific theme (light/dark)
     * 
     * @param {Object} state - Current state
     * @param {Object} action - Action with payload
     */
    setTheme: (state, action) => {
      state.mode = action.payload
      
      // Persist to localStorage
      localStorage.setItem('theme', action.payload)
      
      // Update DOM
      const root = document.documentElement
      root.setAttribute('data-theme', action.payload)
      
      if (action.payload === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    },
    
    /**
     * Toggle Theme
     * ============
     * Switch between light and dark mode
     */
    toggleTheme: (state) => {
      const newTheme = state.mode === 'light' ? 'dark' : 'light'
      state.mode = newTheme
      
      // Persist to localStorage
      localStorage.setItem('theme', newTheme)
      
      // Update DOM
      const root = document.documentElement
      root.setAttribute('data-theme', newTheme)
      
      if (newTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    },
  },
})

// Export actions
export const { setTheme, toggleTheme } = themeSlice.actions

// Export selectors
export const selectTheme = (state) => state.theme.mode
export const selectIsDark = (state) => state.theme.mode === 'dark'

// Export reducer
export default themeSlice.reducer
