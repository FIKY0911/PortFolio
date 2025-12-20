// src/api/api.js
// File ini berisi konfigurasi axios untuk komunikasi dengan backend API

// Import library axios untuk melakukan HTTP request (GET, POST, PUT, DELETE)
import axios from 'axios';

/**
 * Membuat instance axios dengan konfigurasi default
 * Instance ini akan digunakan di seluruh aplikasi untuk konsistensi
 */
const api = axios.create({
  // baseURL: URL dasar untuk semua request API
  // import.meta.env.VITE_BASE_URL mengambil nilai dari file .env (contoh: http://localhost:8000)
  // Semua request akan otomatis ditambahkan prefix ini
  // Contoh: api.get('/profiles') akan menjadi http://localhost:8000/api/profiles
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  
  // timeout: Batas waktu maksimal request dalam milidetik (10 detik)
  // Jika request lebih dari 10 detik, akan otomatis dibatalkan dan error
  timeout: 10000,
  
  // headers: Header default yang akan dikirim di setiap request
  headers: {
    // Content-Type: Memberitahu server bahwa kita mengirim data dalam format JSON
    'Content-Type': 'application/json',
    
    // Authorization: Akan ditambahkan nanti untuk autentikasi user
    // Format: 'Bearer {token}' untuk protected routes
    // Contoh: 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

/**
 * CARA PENGGUNAAN:
 * 
 * 1. GET Request (Ambil data):
 *    import api from './api/Api'
 *    const response = await api.get('/profiles')
 *    console.log(response.data)
 * 
 * 2. POST Request (Kirim data baru):
 *    const response = await api.post('/profiles', { name: 'John', image: file })
 * 
 * 3. PUT Request (Update data):
 *    const response = await api.put('/profiles/1', { name: 'Jane' })
 * 
 * 4. DELETE Request (Hapus data):
 *    const response = await api.delete('/profiles/1')
 * 
 * 5. Dengan Authorization (untuk protected routes):
 *    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
 */

// Export instance api agar bisa digunakan di file lain
export default api;
