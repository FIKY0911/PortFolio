const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${BASE}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function getProfile() { return request('/profile'); }
export function getTools() { return request('/tools'); }
export function getProjects() { return request('/projects'); }
export function getCategories() { return request('/categories'); }
export function getCertificates() { return request('/certificates'); }