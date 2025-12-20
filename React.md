# Theme Switcher Documentation

Dokumentasi lengkap untuk fitur Theme Switcher (Light/Dark Mode) di aplikasi React.

## Daftar Isi

1. [Overview](#overview)
2. [Struktur File](#struktur-file)
3. [Cara Kerja](#cara-kerja)
4. [Penjelasan Kode](#penjelasan-kode)
5. [Cara Penggunaan](#cara-penggunaan)
6. [Kustomisasi](#kustomisasi)

---

## Overview

Theme Switcher ini menggunakan pendekatan yang mirip dengan **shadcn/ui**, yaitu:
- Menggunakan React Context untuk state management
- Menyimpan preferensi tema di localStorage
- Mendeteksi preferensi sistem (OS dark mode)
- Smooth transition saat berganti tema
- Terintegrasi dengan DaisyUI theme system

---

## Struktur File

```
frontend/src/
├── components/
│   ├── context/
│   │   └── ThemeContext.jsx    # Context provider untuk tema
│   └── ThemeSwitcher.jsx       # Komponen tombol toggle tema
├── main.jsx                    # Entry point (ThemeProvider di sini)
└── index.css                   # CSS dengan dark mode support
```

---

## Cara Kerja

### Alur Data Theme

```
┌─────────────────────────────────────────────────────────────┐
│                        ThemeProvider                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  State: theme ('light' | 'dark')                     │   │
│  │                                                       │   │
│  │  1. Init: Cek localStorage → preferensi sistem       │   │
│  │  2. Update: Simpan ke localStorage + data-theme      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Context Value:                                       │   │
│  │  - theme: string                                      │   │
│  │  - setTheme: function                                 │   │
│  │  - toggleTheme: function                              │   │
│  │  - isDark: boolean                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                 │
│              ┌─────────────┴─────────────┐                  │
│              ▼                           ▼                  │
│     ThemeSwitcher              Komponen Lainnya             │
│     (Toggle Button)            (useTheme hook)              │
└─────────────────────────────────────────────────────────────┘
```

### Sinkronisasi dengan DOM

```
User klik toggle
       │
       ▼
setTheme('dark')
       │
       ▼
useEffect triggered
       │
       ├──► localStorage.setItem('theme', 'dark')
       │
       └──► document.documentElement.setAttribute('data-theme', 'dark')
                    │
                    ▼
            DaisyUI membaca data-theme
                    │
                    ▼
            CSS variables berubah → UI update
```

---

## Penjelasan Kode

### 1. ThemeContext.jsx

```jsx
/**
 * File ini adalah "otak" dari sistem tema.
 * Menggunakan React Context API untuk menyediakan state tema
 * ke seluruh aplikasi.
 */

// createContext - Membuat "wadah" untuk state global
const ThemeContext = createContext(null)

// ThemeProvider - Komponen wrapper yang menyediakan state
export const ThemeProvider = ({ children }) => {
  // State untuk menyimpan tema saat ini
  const [theme, setTheme] = useState('light')

  // Effect 1: Inisialisasi tema saat app dimuat
  useEffect(() => {
    // Prioritas: localStorage > preferensi sistem > default
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Cek apakah OS menggunakan dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // Effect 2: Sinkronisasi tema ke DOM dan localStorage
  useEffect(() => {
    // Update atribut data-theme di <html> untuk DaisyUI
    document.documentElement.setAttribute('data-theme', theme)
    // Simpan ke localStorage untuk persistensi
    localStorage.setItem('theme', theme)
  }, [theme])

  // Fungsi toggle tema
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook untuk akses mudah ke context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider')
  }
  return context
}
```

**Konsep Penting:**

| Konsep | Penjelasan |
|--------|------------|
| `createContext` | Membuat "wadah" untuk state yang bisa diakses dari mana saja |
| `Provider` | Komponen yang "menyediakan" state ke child components |
| `useContext` | Hook untuk "mengambil" state dari context |
| `localStorage` | Web API untuk menyimpan data di browser (persisten) |
| `matchMedia` | Web API untuk mendeteksi media queries (termasuk dark mode OS) |

---

### 2. ThemeSwitcher.jsx

```jsx
/**
 * Komponen tombol untuk toggle tema.
 * Ada 3 varian: default, minimal, dan with label.
 */

const ThemeSwitcher = ({ className = '' }) => {
  // Ambil state dari context
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button onClick={toggleTheme}>
      {/* Icon berubah berdasarkan tema */}
      {isDark ? (
        <i className="ri-sun-line" />  // Tampil saat dark mode
      ) : (
        <i className="ri-moon-line" /> // Tampil saat light mode
      )}
    </button>
  )
}
```

**Varian yang Tersedia:**

| Komponen | Kegunaan |
|----------|----------|
| `ThemeSwitcher` | Default dengan border, cocok untuk standalone |
| `ThemeSwitcherMinimal` | Tanpa border, cocok untuk navbar |
| `ThemeSwitcherWithLabel` | Dengan text label, cocok untuk settings |

---

### 3. main.jsx

```jsx
/**
 * Entry point aplikasi.
 * ThemeProvider HARUS membungkus App agar tema bisa diakses.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>  {/* ← Wrapper untuk tema */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

**Kenapa ThemeProvider di main.jsx?**
- Agar SEMUA komponen di dalam App bisa mengakses tema
- Jika ditaruh di tempat lain, komponen di luar wrapper tidak bisa akses

---

### 4. index.css

```css
/**
 * CSS untuk dark mode support.
 * DaisyUI menggunakan data-theme attribute.
 */

/* Transition smooth saat tema berubah */
body {
  transition-property: background-color, color;
  transition-duration: 200ms;
}

/* Style untuk dark mode */
[data-theme="dark"] body {
  background: #111827;
  color: #f3f4f6;
}
```

---

## Cara Penggunaan

### Basic Usage

```jsx
import { useTheme } from './components/context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <div>
      <p>Tema saat ini: {theme}</p>
      <button onClick={toggleTheme}>
        Toggle ke {isDark ? 'Light' : 'Dark'}
      </button>
    </div>
  )
}
```

### Menggunakan ThemeSwitcher Component

```jsx
import ThemeSwitcher, { 
  ThemeSwitcherMinimal, 
  ThemeSwitcherWithLabel 
} from './components/ThemeSwitcher'

function Navbar() {
  return (
    <nav>
      {/* Pilih salah satu varian */}
      <ThemeSwitcher />
      {/* atau */}
      <ThemeSwitcherMinimal />
      {/* atau */}
      <ThemeSwitcherWithLabel />
    </nav>
  )
}
```

### Conditional Styling Berdasarkan Tema

```jsx
function Card() {
  const { isDark } = useTheme()

  return (
    <div className={isDark ? 'bg-gray-800' : 'bg-white'}>
      Content
    </div>
  )
}
```

### Menggunakan Tailwind Dark Mode

```jsx
// Tailwind dark: prefix juga bisa digunakan
function Card() {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      Content
    </div>
  )
}
```

---

## Kustomisasi

### Mengganti Tema DaisyUI

Edit `ThemeContext.jsx`, ganti value tema:

```jsx
// Dari
setTheme(prefersDark ? 'dark' : 'light')

// Ke tema DaisyUI lain
setTheme(prefersDark ? 'night' : 'cupcake')
```

Tema DaisyUI yang tersedia:
- light, dark, cupcake, bumblebee, emerald, corporate
- synthwave, retro, cyberpunk, valentine, halloween
- garden, forest, aqua, lofi, pastel, fantasy
- wireframe, black, luxury, dracula, cmyk, autumn
- business, acid, lemonade, night, coffee, winter

### Mengganti Icon

Edit `ThemeSwitcher.jsx`:

```jsx
// Ganti icon Remix dengan icon lain
{isDark ? (
  <i className="ri-sun-fill" />      // Filled sun
) : (
  <i className="ri-moon-fill" />     // Filled moon
)}

// Atau gunakan emoji
{isDark ? '☀️' : '🌙'}

// Atau gunakan SVG custom
{isDark ? <SunIcon /> : <MoonIcon />}
```

### Menambah Tema Ketiga (System)

```jsx
const [theme, setTheme] = useState('system') // 'light' | 'dark' | 'system'

useEffect(() => {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}, [theme])
```

---

## Troubleshooting

### Tema tidak berubah?

1. Pastikan `ThemeProvider` membungkus `App` di `main.jsx`
2. Cek apakah `data-theme` attribute ada di `<html>` element
3. Clear localStorage: `localStorage.removeItem('theme')`

### Flash of wrong theme saat load?

Tambahkan script di `index.html` sebelum React load:

```html
<script>
  const theme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', theme)
</script>
```

### Error "useTheme harus digunakan di dalam ThemeProvider"?

Komponen yang menggunakan `useTheme()` harus berada di dalam `ThemeProvider`. Pastikan struktur seperti ini:

```jsx
<ThemeProvider>
  <App>
    <KomponenYangMenggunakanUseTheme />
  </App>
</ThemeProvider>
```

---

## Referensi

- [React Context API](https://react.dev/reference/react/useContext)
- [DaisyUI Themes](https://daisyui.com/docs/themes/)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [shadcn/ui Theme](https://ui.shadcn.com/docs/dark-mode)

