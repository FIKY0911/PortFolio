import { create } from 'zustand'
import { listProject, listTools, projectCategories, listCertificates, profileData } from '../data/data'

export const useDataStore = create((set) => ({
  profile: profileData,
  projects: listProject,
  tools: listTools,
  categories: projectCategories,
  certificates: listCertificates,
  
  // Search/Filter logic could be added here if needed in the future
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term })
}))
