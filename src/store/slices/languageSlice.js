/**
 * ============================================================================
 * languageSlice.js - Language State Management
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. I18N STATE MANAGEMENT
 *    - Centralized language state
 *    - Sync dengan i18next
 *    - Persist language preference
 * 
 * 2. ASYNC ACTIONS
 *    - createAsyncThunk untuk async operations
 *    - Handle loading states
 *    - Error handling
 * 
 * 3. EXTRA REDUCERS
 *    - Handle async action states
 *    - pending, fulfilled, rejected
 *    - Update state based on async results
 * 
 * INTEGRATION:
 * - Works with react-i18next
 * - Persist to localStorage
 * - Fallback to browser language
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import i18n from '../../i18n'

/**
 * Get Initial Language
 * ====================
 * Priority: localStorage > browser language > 'id'
 */
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('language')
  if (savedLang) return savedLang
  
  const browserLang = navigator.language.split('-')[0]
  return ['id', 'en'].includes(browserLang) ? browserLang : 'id'
}

/**
 * Change Language Async
 * ======================
 * Async thunk untuk change language dengan i18next
 * 
 * BENEFITS:
 * - Handle async i18n.changeLanguage
 * - Loading states
 * - Error handling
 */
export const changeLanguageAsync = createAsyncThunk(
  'language/changeLanguage',
  async (lang, { rejectWithValue }) => {
    try {
      await i18n.changeLanguage(lang)
      localStorage.setItem('language', lang)
      return lang
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

/**
 * Language Slice
 * ==============
 * Manage language state for i18n
 */
const languageSlice = createSlice({
  name: 'language',
  
  initialState: {
    current: getInitialLanguage(), // 'id' or 'en'
    loading: false,
    error: null,
  },
  
  reducers: {
    /**
     * Set Language (Sync)
     * ===================
     * Synchronous language change
     */
    setLanguage: (state, action) => {
      state.current = action.payload
      localStorage.setItem('language', action.payload)
    },
  },
  
  /**
   * Extra Reducers
   * ==============
   * Handle async actions (changeLanguageAsync)
   */
  extraReducers: (builder) => {
    builder
      // Pending: Language change in progress
      .addCase(changeLanguageAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      // Fulfilled: Language changed successfully
      .addCase(changeLanguageAsync.fulfilled, (state, action) => {
        state.current = action.payload
        state.loading = false
        state.error = null
      })
      // Rejected: Language change failed
      .addCase(changeLanguageAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Export actions
export const { setLanguage } = languageSlice.actions

// Export selectors
export const selectLanguage = (state) => state.language.current
export const selectLanguageLoading = (state) => state.language.loading
export const selectLanguageError = (state) => state.language.error

// Export reducer
export default languageSlice.reducer
