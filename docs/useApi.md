# useApi Hook

**File:** `frontend/src/hooks/useApi.js`

## Deskripsi
Custom React hook untuk data fetching dengan fitur caching, retry, dan multi-language support.

## Fitur Utama
- ✅ In-memory caching
- ✅ Stale-while-revalidate pattern
- ✅ Automatic retry on failure
- ✅ Request deduplication
- ✅ Background refresh
- ✅ Multi-language support (Accept-Language header)
- ✅ Auto refetch saat bahasa berubah

## Fungsi Utama

### `useApi(endpoint, options)`
```javascript
const { data, loading, error, refetch } = useApi('/projects')
```

**Parameter:**
- `endpoint` - API endpoint (contoh: `/projects`, `/skills`)
- `options` - Object konfigurasi (optional)
  - `enabled` - Enable/disable fetch (default: `true`)
  - `onSuccess` - Callback saat fetch berhasil
  - `onError` - Callback saat fetch error

**Return:**
- `data` - Data dari API
- `loading` - Status loading (boolean)
- `error` - Error message (jika ada)
- `refetch` - Function untuk refetch manual

### `prefetchApi(endpoint)`
```javascript
await prefetchApi('/projects')
```
- Preload data sebelum dibutuhkan
- Data disimpan di cache
- Berguna untuk optimasi performa

### `clearApiCache(endpoint)`
```javascript
clearApiCache('/projects') // Clear specific endpoint
clearApiCache() // Clear all cache
```
- Menghapus cache untuk endpoint tertentu atau semua cache

### `getCacheStatus()`
```javascript
const status = getCacheStatus()
console.log(status)
```
- Melihat status cache (age, isStale, isExpired)
- Berguna untuk debugging

## Konfigurasi Default

```javascript
const DEFAULT_CONFIG = {
  cacheTime: 5 * 60 * 1000,    // 5 menit cache
  staleTime: 30 * 1000,         // 30 detik sebelum stale
  retryCount: 3,                // Retry 3x jika gagal
  retryDelay: 1000,             // Delay 1 detik antar retry
  revalidateOnFocus: true,      // Refetch saat window focus
  revalidateOnReconnect: true,  // Refetch saat reconnect
}
```

## Cache Strategy

### 1. First Load
```
User request → Check cache → No cache → Fetch API → Save to cache → Return data
```

### 2. Subsequent Load (Fresh)
```
User request → Check cache → Cache fresh → Return from cache (instant!)
```

### 3. Subsequent Load (Stale)
```
User request → Check cache → Cache stale → Return stale data → Fetch API in background → Update cache
```

## Multi-Language Support

### Cara Kerja
1. Hook detect bahasa dari `i18n.language`
2. Kirim header `Accept-Language: id` atau `Accept-Language: en`
3. Backend return data sesuai bahasa
4. Saat bahasa berubah, cache di-clear dan data di-refetch otomatis

### Event Listener
```javascript
i18n.on('languageChanged', () => {
  cache.delete(cacheKey)
  fetchData(true)
})
```

## Contoh Penggunaan

### Basic Usage
```javascript
function ProjectList() {
  const { data: projects, loading, error } = useApi('/projects')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  )
}
```

### With Callbacks
```javascript
const { data, loading } = useApi('/projects', {
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error)
})
```

### Conditional Fetching
```javascript
const [enabled, setEnabled] = useState(false)
const { data } = useApi('/projects', { enabled })

// Fetch hanya jika enabled = true
```

### Manual Refetch
```javascript
const { data, refetch } = useApi('/projects')

<button onClick={refetch}>Refresh Data</button>
```

### Prefetch untuk Optimasi
```javascript
// Prefetch saat hover
<Link 
  to="/projects"
  onMouseEnter={() => prefetchApi('/projects')}
>
  View Projects
</Link>
```

## Request Deduplication
Jika ada 2 komponen yang fetch endpoint yang sama secara bersamaan, hanya 1 request yang dikirim:

```javascript
// Component A
const { data } = useApi('/projects')

// Component B (di-render bersamaan)
const { data } = useApi('/projects')

// Result: Hanya 1 request ke API, kedua komponen share data yang sama
```

## Keuntungan
- **Fast**: Data di-cache, tidak perlu fetch ulang
- **Efficient**: Request deduplication, hemat bandwidth
- **Resilient**: Auto retry jika gagal
- **Smart**: Stale-while-revalidate untuk UX yang baik
- **Multi-language**: Auto refetch saat ganti bahasa
- **Developer Friendly**: Simple API, mudah digunakan
