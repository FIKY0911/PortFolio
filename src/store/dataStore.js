import { create } from 'zustand';
import {
  listProject,
  listTools,
  projectCategories,
  listCertificates,
  profileData,
} from '../data/data';
import {
  getProfile,
  getTools,
  getProjects,
  getCategories,
  getCertificates,
} from '../services/api';

// Adapter API (camelCase) → bentuk legacy yang dikonsumsi komponen.
// Typo `descripstion` DIPERTAHANKAN demi kompatibilitas komponen (RFC-001 §3.3).
const adaptProfile = ({ name, imageUrl, cvUrl }) => ({
  name,
  image_url: imageUrl,
  cv_url: cvUrl,
});

const adaptTool = ({ id, name, imageUrl, keterangan }) => ({
  id,
  name,
  image_url: imageUrl,
  keterangan,
});

const adaptProject = ({
  id,
  title,
  imageUrl,
  referanceUrl,
  githubUrl,
  description,
  tools,
}) => ({
  id,
  title,
  image_url: imageUrl,
  referance_url: referanceUrl,
  github_url: githubUrl ?? '',
  descripstion: description,
  tools: Array.isArray(tools) ? tools.map((t) => t.name) : [],
});

const adaptCategory = ({ id, key, title }) => ({ id, key, title });

const adaptCertificate = ({ id, title, imageUrl }) => ({
  id,
  title,
  image_url: imageUrl,
});

export const useDataStore = create((set) => ({
  // State awal = data statis; fetchAll() me-replace per-bagian jika endpoint sukses.
  profile: profileData,
  projects: listProject,
  tools: listTools,
  categories: projectCategories,
  certificates: listCertificates,
  isBackendConnected: false,

  // Search/Filter logic could be added here if needed in the future
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Ambil 5 endpoint paralel; endpoint gagal → pertahankan nilai statis.
  fetchAll: async () => {
    const results = await Promise.allSettled([
      getProfile(),
      getTools(),
      getProjects(),
      getCategories(),
      getCertificates(),
    ]);

    const ok = (i) =>
      results[i].status === 'fulfilled' && results[i].value?.success === true;
    const list = (i) => results[i].value?.data;

    const patch = {};
    let connected = false;
    if (ok(0) && list(0)) {
      patch.profile = adaptProfile(list(0));
      connected = true;
    }
    if (ok(1) && Array.isArray(list(1))) {
      patch.tools = list(1).map(adaptTool);
      connected = true;
    }
    if (ok(2) && Array.isArray(list(2))) {
      patch.projects = list(2).map(adaptProject);
      connected = true;
    }
    if (ok(3) && Array.isArray(list(3))) {
      patch.categories = list(3).map(adaptCategory);
      connected = true;
    }
    if (ok(4) && Array.isArray(list(4))) {
      patch.certificates = list(4).map(adaptCertificate);
      connected = true;
    }
    patch.isBackendConnected = connected;
    set(patch);
  },
}));