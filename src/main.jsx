/**
 * ============================================================================
 * main.jsx - Entry Point Aplikasi React
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. ENTRY POINT PATTERN
 *    - File ini adalah titik masuk utama aplikasi React
 *    - Bertanggung jawab untuk mounting React app ke DOM
 *    - Setup global providers dan configurations
 * 
 * 2. REACT 18 FEATURES
 *    - createRoot: API baru React 18 untuk concurrent rendering
 *    - Menggantikan ReactDOM.render() dari React 17
 *    - Memberikan performa lebih baik dengan automatic batching
 * 
 * 3. STRICTMODE
 *    - Development tool untuk mendeteksi potential problems
 *    - Mengaktifkan additional checks dan warnings
 *    - Hanya berjalan di development, tidak di production
 *    - Double-invokes lifecycle methods untuk detect side effects
 * 
 * 4. PROVIDER PATTERN
 *    - ThemeProvider: Context untuk dark/light mode
 *    - Wrap di level tertinggi agar accessible di semua komponen
 *    - Pattern ini disebut "Provider Pattern" atau "Context Pattern"
 * 
 * 5. GLOBAL IMPORTS
 *    - CSS: index.css (Tailwind base styles)
 *    - animate.css: Library animasi CSS
 *    - remixicon: Icon library
 *    - i18n: Internationalization setup (multi-bahasa)
 * 
 * 6. BEST PRACTICES
 *    - Import order: React → Libraries → Styles → Local files
 *    - Setup i18n sebelum render App (side effect import)
 *    - Single responsibility: File ini hanya untuk setup dan mounting
 * 
 * TIPS UNTUK JUNIOR:
 * - Jangan tambahkan logic bisnis di sini
 * - Hanya untuk setup global configuration
 * - Provider order matters: Outer provider accessible di inner provider
 * - StrictMode membantu catch bugs early, jangan disable!
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'animate.css'
import 'remixicon/fonts/remixicon.css'
import './i18n' // Import i18n configuration (side effect import)
import App from './App.jsx'
import { ThemeProvider } from './components/context/ThemeContext'

// Mount React app ke DOM element dengan id="root"
// createRoot adalah React 18 API untuk concurrent features
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ThemeProvider membungkus App agar dark mode accessible di semua komponen */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
