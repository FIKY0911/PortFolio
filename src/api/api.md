# API Configuration Documentation

Dokumentasi untuk file `Api.js` - Konfigurasi Axios unasi dengan backend.

---

## Overview

File `Api.js` berisi konfigurasi instance Axios yang digunakan untuk melakukan HTTP request ke backend API. Instance ini dikonfigurasi dengan base URL, timeout, dan headers default untuk konsistensi di seluruh aplikasi.

---

## Struktur File

```
frontend/src/api/
└── Api.js          # Konfigurasi axios instance
```

---

## Kode Lengkap dengan Penjelasan

```javascript
// src/api/Api.js
// File ini berisi konfigurasi axios untuk komunikasi dengan backend API

// Import library axios untuk melakukan HTTP request (GET, POST, PUT, DELETE)
import axios from 'axios';

/**
 * Membuat instance axios dengan konfigurasi default
 * Instance ini akan digunakan di seluruh aplikasi untuk konsistensi
 */
const api = axios.create({
  // baseURL: URL dasar untuk semua request API
  // import.meta.env.VITE_BASE_URL mengambil nilai dari file .env
  // Contoh: http://localhost:8000
  // Semua request akan otomatis ditambahkan prefix ini
  // Contoh: api.get('/profiles') → http://localhost:8000/api/profiles
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  
  // timeout: Batas waktu maksimal request dalam milidetik (10 detik)
  // Jika request lebih dari 10 detik, akan otomatis dibatalkan dan error
  timeout: 10000,
  
  // headers: Header default yang akan dikirim di setiap request
  headers: {
    // Content-Type: Memberitahu server bahwa kita mengirim data dalam format JSON
    'Content-Type': 'application/json',
  },
});

// Export instance api agar bisa digunakan di file lain
export default api;
```

---

## Konfigurasi

### 1. Base URL

```javascript
baseURL: `${import.meta.env.VITE_BASE_URL}/api`
```

| Property | Nilai | Keterangan |
|----------|-------|------------|
| `VITE_BASE_URL` | `http://localhost:8000` | Diambil dari file `.env` |
| Path prefix | `/api` | Ditambahkan otomatis ke semua request |
| Full URL | `http://localhost:8000/api` | Base URL lengkap |

**Contoh Request:**
```javascript
api.get('/profiles')     // → GET http://localhost:8000/api/profiles
api.get('/skills')       // → GET http://localhost:8000/api/skills
api.get('/projects')     // → GET http://localhost:8000/api/projects
```

### 2. Timeout

```javascript
timeout: 10000  // 10 detik dalam milidetik
```

- Request akan otomatis dibatalkan jika melebihi 10 detik
- Mencegah aplikasi hang karena request yang terlalu lama
- Error yang dihasilkan: `ECONNABORTED` atau `timeout of 10000ms exceeded`

### 3. Headers Default

```javascript
headers: {
  'Content-Type': 'application/json',
}
```

| Header | Nilai | Fungsi |
|--------|-------|--------|
| `Content-Type` | `application/json` | Memberitahu server format data yang dikirim |

---

## Cara Penggunaan

### Import Instance

```javascript
import api from './api/Api';
// atau dari folder lain
import api from '../api/Api';
```

### 1. GET Request (Ambil Data)

```javascript
// Ambil semua data
const response = await api.get('/profiles');
console.log(response.data);

// Ambil data dengan parameter
const response = await api.get('/skills', {
  params: { category: 'frontend' }
});
// → GET /api/skills?category=frontend
```

### 2. POST Request (Kirim Data Baru)

```javascript
// Kirim data JSON
const response = await api.post('/profiles', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Kirim FormData (untuk upload file)
const formData = new FormData();
formData.append('name', 'John');
formData.append('image', fileInput.files[0]);

const response = await api.post('/profiles', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### 3. PUT Request (Update Data)

```javascript
const response = await api.put('/profiles/1', {
  name: 'Jane Doe'
});
```

### 4. DELETE Request (Hapus Data)

```javascript
const response = await api.delete('/profiles/1');
```

### 5. Dengan Authorization Token

```javascript
// Set token untuk semua request berikutnya
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Atau per-request
const response = await api.get('/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Contoh Penggunaan di Component

### Fetch Data dengan useEffect

```javascript
import { useState, useEffect } from 'react';
import api from '../api/Api';

const ProfileComponent = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{profile?.name}</div>;
};
```

### Submit Form

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await api.post('/contact', {
      name: formData.name,
      email: formData.email,
      message: formData.message
    });
    
    alert('Pesan berhasil dikirim!');
  } catch (error) {
    alert('Gagal mengirim pesan: ' + error.message);
  }
};
```

---

## Error Handling

### Struktur Error Axios

```javascript
try {
  const response = await api.get('/profiles');
} catch (error) {
  if (error.response) {
    // Server merespons dengan status error (4xx, 5xx)
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
    console.log('Headers:', error.response.headers);
  } else if (error.request) {
    // Request dibuat tapi tidak ada respons (network error)
    console.log('No response:', error.request);
  } else {
    // Error saat setup request
    console.log('Error:', error.message);
  }
}
```

### Common Errors

| Status | Keterangan | Solusi |
|--------|------------|--------|
| `400` | Bad Request | Cek format data yang dikirim |
| `401` | Unauthorized | Token tidak valid/expired |
| `403` | Forbidden | Tidak punya akses |
| `404` | Not Found | Endpoint tidak ditemukan |
| `422` | Validation Error | Data tidak lolos validasi |
| `500` | Server Error | Error di backend |
| `ECONNABORTED` | Timeout | Request melebihi batas waktu |
| `Network Error` | Tidak ada koneksi | Cek koneksi internet/backend |

---

## Environment Variables

File `.env` di root folder frontend:

```env
# Backend API URL
VITE_BASE_URL=http://localhost:8000
```

> **Penting:** 
> - Semua env variable di Vite HARUS diawali dengan `VITE_`
> - Restart dev server setelah mengubah `.env`
> - Jangan commit file `.env` ke repository (sudah ada di `.gitignore`)

---

## Axios vs Fetch

| Fitur | Axios | Fetch |
|-------|-------|-------|
| Auto JSON parse | ✅ Ya | ❌ Manual `.json()` |
| Timeout | ✅ Built-in | ❌ Manual dengan AbortController |
| Interceptors | ✅ Ya | ❌ Tidak |
| Request cancel | ✅ Ya | ✅ AbortController |
| Progress upload | ✅ Ya | ❌ Tidak |
| Browser support | ✅ Semua | ✅ Modern browsers |

**Kenapa pakai Axios?**
- Lebih mudah dikonfigurasi
- Auto transform JSON
- Built-in timeout
- Interceptors untuk handle token/error global

---

## Tips & Best Practices

1. **Gunakan instance** - Jangan pakai `axios` langsung, gunakan instance `api` yang sudah dikonfigurasi

2. **Handle loading state** - Selalu tampilkan loading indicator saat fetch

3. **Handle error** - Selalu wrap request dengan try-catch

4. **Gunakan async/await** - Lebih readable daripada `.then().catch()`

5. **Cancel request** - Gunakan AbortController untuk cancel request saat component unmount

```javascript
useEffect(() => {
  const controller = new AbortController();
  
  api.get('/profiles', { signal: controller.signal })
    .then(res => setData(res.data))
    .catch(err => {
      if (err.name !== 'CanceledError') {
        setError(err.message);
      }
    });
  
  return () => controller.abort();
}, []);
```

