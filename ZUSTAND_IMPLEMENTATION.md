# Implementasi Zustand di Portfolio

## 📦 Stores yang Tersedia

### 1. **themeStore** (`src/store/themeStore.js`)
Mengelola state dark/light mode dengan persist ke localStorage.

```javascript
import { useThemeStore } from './store/themeStore'

const { darkMode, toggleDarkMode, setDarkMode } = useThemeStore()
```

**State:**
- `darkMode` (boolean): Status dark mode aktif atau tidak

**Actions:**
- `toggleDarkMode()`: Toggle antara dark/light mode
- `setDarkMode(isDark)`: Set dark mode secara langsung

**Features:**
- Auto persist ke localStorage
- Auto sync dengan document.documentElement.classList
- Deteksi system preference saat pertama load

---

### 2. **languageStore** (`src/store/languageStore.js`)
Mengelola state bahasa aplikasi (ID/EN) dengan sync ke i18next.

```javascript
import { useLanguageStore } from './store/languageStore'

const { language, setLanguage } = useLanguageStore()
```

**State:**
- `language` (string): Bahasa aktif ('id' atau 'en')

**Actions:**
- `setLanguage(lang)`: Ganti bahasa dan sync dengan i18next

---

### 3. **dataStore** (`src/store/dataStore.js`)
Mengelola data aplikasi (projects, tools, certificates, dll).

```javascript
import { useDataStore } from './store/dataStore'

const { projects, tools, categories, certificates, profile } = useDataStore()
```

**State:**
- `profile`: Data profil user
- `projects`: List project portfolio
- `tools`: List teknologi yang dikuasai
- `categories`: Kategori project
- `certificates`: List sertifikat
- `selectedCategory`: Filter kategori yang dipilih
- `searchTerm`: Term untuk search

**Actions:**
- `setSelectedCategory(category)`: Set kategori yang dipilih
- `setSearchTerm(term)`: Set search term

---

## 🎯 Cara Penggunaan

### Basic Usage
```javascript
import { useThemeStore } from './store/themeStore'

function MyComponent() {
  const darkMode = useThemeStore((state) => state.darkMode)
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode)
  
  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

### Destructuring (Shorthand)
```javascript
import { useThemeStore } from './store/themeStore'

function MyComponent() {
  const { darkMode, toggleDarkMode } = useThemeStore()
  
  return (
    <button onClick={toggleDarkMode}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

### Selector untuk Performance
```javascript
// ✅ Hanya re-render jika darkMode berubah
const darkMode = useThemeStore((state) => state.darkMode)

// ❌ Re-render setiap kali store berubah
const { darkMode } = useThemeStore()
```

---

## 📁 Komponen yang Menggunakan Zustand

### Theme Management
- `src/components/ThemeSwitcher.jsx`
- `src/components/ThemeSwitcher.jsx` (ThemeSwitcherMinimal)
- `src/components/ThemeSwitcher.jsx` (ThemeSwitcherWithLabel)

### Language Management
- `src/components/LanguageSwitcher.jsx`
- `src/components/LanguageSwitcher.jsx` (LanguageSwitcherMinimal)

### Data Management
- `src/pages/Project.jsx`
- `src/components/skill/fragments/Card.jsx`
- `src/components/home/CertificateSection.jsx`
- `src/components/home/HomeProject.jsx`
- `src/components/home/HeroSection.jsx`

---

## 🚀 Keuntungan Menggunakan Zustand

1. **Simple & Minimal** - Tidak perlu Provider atau boilerplate
2. **Performance** - Hanya re-render komponen yang subscribe ke state yang berubah
3. **TypeScript Ready** - Built-in TypeScript support
4. **DevTools** - Support Redux DevTools untuk debugging
5. **Middleware** - Support persist, devtools, immer, dll
6. **Small Bundle** - Hanya ~1kb gzipped

---

## 📝 Tips

1. Gunakan selector untuk optimize performance
2. Gunakan persist middleware untuk data yang perlu disimpan
3. Split store per domain (theme, language, data, dll)
4. Hindari nested state yang dalam
5. Gunakan immer middleware untuk immutable state yang kompleks
