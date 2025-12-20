/**
 * apiService.js
 * =============
 * Centralized API service dengan caching dan optimasi.
 */

import { prefetchApi } from '../hooks/useApi';

const baseUrl = import.meta.env.VITE_BASE_URL;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  PROFILE: '/profile',
  SKILLS: '/skills',
  SKILL_DETAIL: (id) => `/skills/${id}`,
  PROJECTS: '/projects',
  PROJECT_DETAIL: (id) => `/projects/${id}`,
};

/**
 * Prefetch semua data yang dibutuhkan untuk homepage
 * Panggil ini saat app load untuk preload data
 */
export const prefetchHomeData = async () => {
  await Promise.all([
    prefetchApi(API_ENDPOINTS.PROFILE),
    prefetchApi(API_ENDPOINTS.SKILLS),
    prefetchApi(API_ENDPOINTS.PROJECTS),
  ]);
};

/**
 * Prefetch data untuk halaman tertentu
 */
export const prefetchPageData = {
  home: () => prefetchHomeData(),
  skills: () => prefetchApi(API_ENDPOINTS.SKILLS),
  projects: () => prefetchApi(API_ENDPOINTS.PROJECTS),
  skillDetail: (id) => prefetchApi(API_ENDPOINTS.SKILL_DETAIL(id)),
  projectDetail: (id) => prefetchApi(API_ENDPOINTS.PROJECT_DETAIL(id)),
};

export default {
  API_ENDPOINTS,
  prefetchHomeData,
  prefetchPageData,
};
