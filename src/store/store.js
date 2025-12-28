/**
 * ============================================================================
 * store.js - Redux Store Configuration
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. REDUX TOOLKIT (RTK)
 *    - Modern Redux dengan less boilerplate
 *    - configureStore: Setup store dengan defaults
 *    - Built-in Redux DevTools support
 *    - Automatic Redux Thunk middleware
 * 
 * 2. STORE STRUCTURE
 *    - Centralized state management
 *    - Single source of truth
 *    - Predictable state updates
 *    - Time-travel debugging
 * 
 * 3. SLICES
 *    - themeSlice: Theme (dark/light) state
 *    - languageSlice: i18n language state
 *    - dataSlice: Portfolio data (tools, projects)
 * 
 * 4. MIDDLEWARE
 *    - Redux Thunk (built-in): Async actions
 *    - Redux DevTools: Debugging
 *    - Custom middleware (optional)
 * 
 * 5. PERFORMANCE BENEFITS
 *    - Prevent prop drilling
 *    - Memoized selectors
 *    - Efficient re-renders
 *    - Centralized cache
 * 
 * KAPAN GUNAKAN REDUX:
 * ✓ Global state (theme, auth, language)
 * ✓ Complex state logic
 * ✓ State shared across many components
 * ✓ Need time-travel debugging
 * ✗ Simple local state (gunakan useState)
 * ✗ Only 1-2 components need state
 * 
 * TIPS:
 * - Redux bukan silver bullet, gunakan untuk global state
 * - Combine dengan Context API untuk specific use cases
 * - Use Redux DevTools untuk debugging
 * - Keep state normalized (flat structure)
 */

import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import languageReducer from './slices/languageSlice'
import dataReducer from './slices/dataSlice'

/**
 * Configure Redux Store
 * =====================
 * Central store untuk semua global state
 * 
 * FEATURES:
 * - Automatic Redux DevTools integration
 * - Redux Thunk middleware (async actions)
 * - Hot module replacement support
 * - Immutable state updates (Immer.js)
 */
export const store = configureStore({
  reducer: {
    theme: themeReducer,      // Theme state (dark/light)
    language: languageReducer, // Language state (id/en)
    data: dataReducer,         // Portfolio data (tools, projects)
  },
  
  // Middleware configuration (optional)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
})

export default store

