/**
 * useApi.js
 * =========
 * Custom hook untuk data fetching dengan caching dan optimasi.
 * 
 * FITUR:
 * - In-memory caching untuk menghindari fetch berulang
 * - Stale-while-revalidate pattern
 * - Automatic retry on failure
 * - Request deduplication
 * - Background refresh
 * - Multi-language support (Accept-Language header)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import i18n from '../i18n';

// In-memory cache untuk menyimpan data
const cache = new Map();

// Pending requests untuk deduplication
const pendingRequests = new Map();

// Default config
const DEFAULT_CONFIG = {
  cacheTime: 5 * 60 * 1000,    // 5 menit cache
  staleTime: 30 * 1000,         // 30 detik sebelum dianggap stale
  retryCount: 3,
  retryDelay: 1000,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

/**
 * Get cached data
 */
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  const isExpired = now - cached.timestamp > DEFAULT_CONFIG.cacheTime;
  
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return {
    data: cached.data,
    isStale: now - cached.timestamp > DEFAULT_CONFIG.staleTime,
  };
};

/**
 * Set cache data
 */
const setCacheData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Get current language for API requests
 */
const getCurrentLanguage = () => {
  return i18n.language || localStorage.getItem('language') || 'id';
};

/**
 * Fetch with retry mechanism
 */
const fetchWithRetry = async (url, options = {}, retryCount = DEFAULT_CONFIG.retryCount) => {
  const { signal } = options;
  const lang = getCurrentLanguage();
  
  for (let i = 0; i <= retryCount; i++) {
    try {
      const response = await fetch(url, { 
        signal,
        headers: {
          'Accept-Language': lang,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      
      if (i === retryCount) throw error;
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, DEFAULT_CONFIG.retryDelay * (i + 1)));
    }
  }
};

/**
 * useApi Hook
 * Custom hook untuk fetch data dengan caching
 * 
 * @param {string} endpoint - API endpoint (e.g., '/profile', '/skills')
 * @param {object} options - Options { enabled, onSuccess, onError }
 */
export const useApi = (endpoint, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const cacheKey = `${baseUrl}/api${endpoint}`;
  
  const fetchData = useCallback(async (skipCache = false) => {
    if (!enabled) return;
    
    // Check cache first
    if (!skipCache) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setData(cached.data);
        setLoading(false);
        
        // If stale, revalidate in background
        if (cached.isStale) {
          fetchData(true);
        }
        return;
      }
    }
    
    // Check if there's already a pending request for this endpoint
    if (pendingRequests.has(cacheKey)) {
      try {
        const result = await pendingRequests.get(cacheKey);
        setData(result);
        setLoading(false);
        return;
      } catch (err) {
        // Continue to make new request
      }
    }
    
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    // Create fetch promise for deduplication
    const fetchPromise = fetchWithRetry(cacheKey, {
      signal: abortControllerRef.current.signal,
    });
    
    pendingRequests.set(cacheKey, fetchPromise);
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchPromise;
      
      if (result.status && result.data) {
        setCacheData(cacheKey, result.data);
        setData(result.data);
        onSuccess?.(result.data);
      } else {
        setData(null);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        onError?.(err);
      }
    } finally {
      setLoading(false);
      pendingRequests.delete(cacheKey);
    }
  }, [cacheKey, enabled, onSuccess, onError]);
  
  // Initial fetch
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);
  
  // Revalidate on window focus
  useEffect(() => {
    if (!DEFAULT_CONFIG.revalidateOnFocus) return;
    
    const handleFocus = () => {
      const cached = getCachedData(cacheKey);
      if (cached?.isStale) {
        fetchData(true);
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [cacheKey, fetchData]);
  
  // Revalidate on reconnect
  useEffect(() => {
    if (!DEFAULT_CONFIG.revalidateOnReconnect) return;
    
    const handleOnline = () => fetchData(true);
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchData]);
  
  // Refetch when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Clear cache for this endpoint and refetch
      cache.delete(cacheKey);
      fetchData(true);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [cacheKey, fetchData]);
  
  const refetch = useCallback(() => fetchData(true), [fetchData]);
  
  return { data, loading, error, refetch };
};

/**
 * Prefetch data - panggil ini untuk preload data sebelum dibutuhkan
 */
export const prefetchApi = async (endpoint) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const cacheKey = `${baseUrl}/api${endpoint}`;
  
  // Skip if already cached and not stale
  const cached = getCachedData(cacheKey);
  if (cached && !cached.isStale) return;
  
  try {
    const result = await fetchWithRetry(cacheKey);
    if (result.status && result.data) {
      setCacheData(cacheKey, result.data);
    }
  } catch (error) {
    console.warn(`Prefetch failed for ${endpoint}:`, error.message);
  }
};

/**
 * Clear cache - untuk invalidasi manual
 */
export const clearApiCache = (endpoint) => {
  if (endpoint) {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    cache.delete(`${baseUrl}/api${endpoint}`);
  } else {
    cache.clear();
  }
};

/**
 * Get cache status
 */
export const getCacheStatus = () => {
  const status = {};
  cache.forEach((value, key) => {
    const age = Date.now() - value.timestamp;
    status[key] = {
      age: `${Math.round(age / 1000)}s`,
      isStale: age > DEFAULT_CONFIG.staleTime,
      isExpired: age > DEFAULT_CONFIG.cacheTime,
    };
  });
  return status;
};

export default useApi;

