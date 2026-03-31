/**
 * ============================================================================
 * dataSlice.js - Portfolio Data State Management
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. DATA NORMALIZATION
 *    - Flat state structure
 *    - Easy to update
 *    - Prevent nested updates
 * 
 * 2. MEMOIZATION
 *    - Cached data
 *    - Prevent unnecessary re-fetches
 *    - Better performance
 * 
 * 3. SELECTORS
 *    - Derived state
 *    - Filter/transform data
 *    - Reusable logic
 * 
 * 4. BENEFITS
 *    - Single source of truth
 *    - No prop drilling
 *    - Easy to test
 *    - Centralized data management
 * 
 * DATA STRUCTURE:
 * - profile: User profile data
 * - tools: List of skills/tools
 * - projects: List of portfolio projects
 */

import { createSlice } from '@reduxjs/toolkit'
import { listTools, listProject, profileData } from '../../data/data'

/**
 * Data Slice
 * ==========
 * Manage portfolio data (profile, tools, projects)
 */
const dataSlice = createSlice({
  name: 'data',
  
  initialState: {
    profile: profileData,
    tools: listTools,
    projects: listProject,
    
    // Filter states (optional)
    filters: {
      toolLevel: 'all', // 'all', 'Beginner', 'Intermediate', 'Advanced'
      projectTech: 'all', // 'all' or specific tech
    },
  },
  
  reducers: {
    /**
     * Set Tool Filter
     * ===============
     * Filter tools by level
     */
    setToolFilter: (state, action) => {
      state.filters.toolLevel = action.payload
    },
    
    /**
     * Set Project Filter
     * ==================
     * Filter projects by technology
     */
    setProjectFilter: (state, action) => {
      state.filters.projectTech = action.payload
    },
    
    /**
     * Reset Filters
     * =============
     * Reset all filters to default
     */
    resetFilters: (state) => {
      state.filters.toolLevel = 'all'
      state.filters.projectTech = 'all'
    },
    
    /**
     * Update Profile
     * ==============
     * Update profile data (optional)
     */
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
  },
})

// Export actions
export const { 
  setToolFilter, 
  setProjectFilter, 
  resetFilters,
  updateProfile 
} = dataSlice.actions

/**
 * Selectors
 * =========
 * Get data from state with optional filtering
 */

// Basic selectors
export const selectProfile = (state) => state.data.profile
export const selectTools = (state) => state.data.tools
export const selectProjects = (state) => state.data.projects
export const selectFilters = (state) => state.data.filters

// Filtered selectors
export const selectFilteredTools = (state) => {
  const { tools, filters } = state.data
  
  if (filters.toolLevel === 'all') {
    return tools
  }
  
  return tools.filter(tool => tool.keterangan === filters.toolLevel)
}

export const selectFilteredProjects = (state) => {
  const { projects, filters } = state.data
  
  if (filters.projectTech === 'all') {
    return projects
  }
  
  return projects.filter(project => 
    project.tools.includes(filters.projectTech)
  )
}

// Computed selectors
export const selectToolsCount = (state) => state.data.tools.length
export const selectProjectsCount = (state) => state.data.projects.length

// Export reducer
export default dataSlice.reducer
