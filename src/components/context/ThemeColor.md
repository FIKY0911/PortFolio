# ThemeContext.jsx Documentation

Dokumentasi untuk file `ThemeContext.jsx` - Context provider untuk mengelola tema (light/dark) di seluruh apl
--

## Overview

ThemeContext menyediakan state management untuk tema aplikasi dengan fitur:
- Toggle antara light dan dark mode
- Persistensi ke localStorage (tema tersimpan saat refresh)
- Deteksi preferensi sistem (OS dark mode)
- Sinkronisasi dengan Tailwind CSS dan DaisyUI

---

## Struktur File

```
frontend/src/components/context/
├── index.js           # Export GlobalContext
├── ThemeContext.jsx   # Context untuk tema (light/dark mode)
└── ThemeColor.md      # Dokumentasi ini
```

---

## Kode Lengkap dengan Penjelasan

```javascript
import { createContext, useContext, useState, useEffect } from 'react'

// Membuat context untuk tema
// createContext(null) = membuat "wadah" untuk menyimpan state tema
// yang bisa diakses dari komponen manapun tanpa perlu prop drilling
const ThemeContext = createContext(null)
```

### ThemeProvider Component

```javascript
export const ThemeProvider = ({ children }) => {
  // State untuk menyimpan tema saat ini
  // Default: 'light'
  // useState('light') = State untuk menyimpan tema ('light' atau 'dark')
  const [theme, setTheme] = useState('light')
```

**Props:**
| Prop | Tipe | Keterangan |
|------|------|------------|
| `children` | `React.ReactNode` | Child components yang akan dibungkus |

### useEffect Pertama - Inisialisasi Tema

```javascript
  useEffect(() => {
    // Cek apakah ada tema tersimpan di localStorage
    const savedTheme = localStorage.getItem('theme')
    
    if (savedTheme) {
      // Gunakan tema yang tersimpan
      setTheme(savedTheme)
    } else {
      // Cek preferensi sistem (apakah user menggunakan dark mode di OS)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, []) // [] = hanya dijalankan sekali saat mount
```

**Urutan Prioritas:**
1. Cek localStorage (tema yang pernah dipilih user)
2. Jika tidak ada, cek preferensi sistem (dark mode OS)
3. Jika tidak ada, default ke 'light'

### useEffect Kedua - Sinkronisasi Tema

```javascript
  useEffect(() => {
    const root = document.documentElement
    
    // Update atribut data-theme di element <html> untuk DaisyUI
    root.setAttribute('data-theme', theme)
    
    // Tambah/hapus class 'dark' untuk Tailwind CSS dark mode
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Simpan tema ke localStorage
    localStorage.setItem('theme', theme)
  }, [theme]) // Dijalankan setiap kali 'theme' berubah
```

**Setiap kali state 'theme' berubah:**
1. Update atribut `data-theme` di `<html>` (untuk DaisyUI)
2. Tambah/hapus class `dark` di `<html>` (untuk Tailwind dark mode)
3. Simpan ke localStorage (untuk persistensi)

### toggleTheme Function

```javascript
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }
```

Fungsi untuk toggle antara light dan dark mode. Menggunakan functional update untuk memastikan nilai terbaru.

### Context Value

```javascript
  const contextValue = {
    theme,        // Tema saat ini ('light' atau 'dark')
    setTheme,     // Fungsi untuk set tema secara langsung
    toggleTheme,  // Fungsi untuk toggle tema
    isDark: theme === 'dark'  // Boolean helper untuk cek apakah dark mode
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
```

| Property | Tipe | Keterangan |
|----------|------|------------|
| `theme` | `'light' \| 'dark'` | Tema saat ini |
| `setTheme` | `(theme: string) => void` | Set tema secara langsung |
| `toggleTheme` | `() => void` | Toggle light ↔ dark |
| `isDark` | `boolean` | Helper: `true` jika dark mode |

### useTheme Custom Hook

```javascript
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  // Error handling: pastikan hook digunakan di dalam ThemeProvider
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider')
  }
  
  return context
}

export default ThemeContext
```

Custom hook untuk mengakses ThemeContext dengan mudah. Menyediakan error handling jika digunakan di luar ThemeProvider.

---

## Cara Penggunaan

### 1. Wrap App dengan ThemeProvider

```javascript
// main.jsx
import { ThemeProvider } from './components/context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
```

### 2. Gunakan useTheme di Component

```javascript
import { useTheme } from './components/context/ThemeContext'

const ThemeSwitcher = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  )
}
```

### 3. Conditional Styling berdasarkan Tema

```javascript
const MyComponent = () => {
  const { isDark } = useTheme()

  return (
    <div className={isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}>
      Content
    </div>
  )
}
```

### 4. Menggunakan Tailwind Dark Mode

```javascript
// Dengan class dark: di Tailwind
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Content yang otomatis berubah berdasarkan tema
</div>
```

---

## Diagram Alur

```
┌─────────────────────────────────────────────────────────┐
│                     App Start                            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              ThemeProvider Mount                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  useEffect #1: Inisialisasi                     │    │
│  │  1. Cek localStorage('theme')                   │    │
│  │  2. Jika ada → setTheme(savedTheme)            │    │
│  │  3. Jika tidak → cek OS preference             │    │
│  │  4. setTheme('light' atau 'dark')              │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              useEffect #2: Sinkronisasi                  │
│  1. document.documentElement.setAttribute('data-theme') │
│  2. classList.add/remove('dark')                        │
│  3. localStorage.setItem('theme')                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              User Click Toggle                           │
│  toggleTheme() → setTheme() → useEffect #2 trigger      │
└─────────────────────────────────────────────────────────┘
```

---

## Integrasi dengan CSS

### Tailwind CSS Dark Mode

File `index.css`:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

Penggunaan di component:
```jsx
<div className="bg-white dark:bg-gray-800">
  {/* Otomatis berubah saat tema toggle */}
</div>
```

### DaisyUI Theme

ThemeContext mengatur `data-theme` attribute di `<html>`:
```html
<!-- Light mode -->
<html data-theme="light">

<!-- Dark mode -->
<html data-theme="dark" class="dark">
```

---

## localStorage Persistence

| Key | Value | Keterangan |
|-----|-------|------------|
| `theme` | `'light'` atau `'dark'` | Tersimpan di browser |

**Behavior:**
- Saat user toggle tema → disimpan ke localStorage
- Saat refresh/buka ulang → tema di-load dari localStorage
- Jika localStorage kosong → gunakan preferensi OS

---

## Error Handling

```javascript
// Jika useTheme digunakan di luar ThemeProvider
const { theme } = useTheme()
// Error: "useTheme harus digunakan di dalam ThemeProvider"
```

**Solusi:** Pastikan component yang menggunakan `useTheme` berada di dalam `<ThemeProvider>`.

---

## Best Practices

1. **Wrap di level tertinggi** - ThemeProvider harus membungkus seluruh aplikasi

2. **Gunakan useTheme hook** - Jangan akses ThemeContext langsung dengan useContext

3. **Manfaatkan isDark** - Gunakan boolean helper untuk conditional rendering

4. **Kombinasikan dengan Tailwind** - Gunakan class `dark:` untuk styling otomatis
