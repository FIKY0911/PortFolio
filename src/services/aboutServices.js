// src/services/helloService.js
import api from '../api/Api.js';

// Fungsi untuk mengambil pesan dari /hello
export const fetchHelloMessage = async () => {
  try {
    const response = await api.get('${baseURL}/about');
    return response.data.message;
  } catch (error) {
    console.error('Gagal menampilkan about', error);
    throw error;
  }
};
