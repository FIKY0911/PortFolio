# Context Documentation

Dokumentasi untuk folder `context/` - State management menggunakan React Context API.

---

## Overview

Folder `conerisi konfigurasi React Context untuk mengelola state global yang perlu diakses oleh banyak komponen tanpa prop drilling.

---

## Struktur Folder

```
frontend/src/components/context/
├── index.js           # Export GlobalContext
├── ThemeContext.jsx   # Context untuk tema (light/dark mode)
└── context.md         # Dokumentasi ini
```

---

## File: index.js

### Kode Lengkap

```javascript
import { createContext } from "react";

export const GlobalContext = createContext(null);
```

### Penjelasan Baris per Baris

```javascript
// Import fungsi createContext dari React
// createContext digunakan untuk membuat "wadah" state global
import { createContext } from "react";

// Membuat context baru dengan nilai default null
// Context ini bisa digunakan untuk menyimpan state apapun yang perlu diakses global
// Contoh: user data, settings, cart items, dll
export const GlobalContext = createContext(null);
```

### Apa itu createContext?

`createContext` adalah fungsi React yang membuat objek Context. Context menyediakan cara untuk melewatkan data melalui component tree tanpa harus melewatkan props secara manual di setiap level (prop drilling).

```
Tanpa Context (Prop Drilling):
App → Header → Navbar → UserMenu → UserName
     ↓ props  ↓ props  ↓ props   ↓ props

Dengan Context:
App (Provider)
  ↓ context
  └── Header
        └── Navbar
              └── UserMenu
                    └── UserName (Consumer) ← langsung akses!
```

### Parameter createContext

```javascript
createContext(defaultValue)
```

| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| `defaultValue` | any | Nilai default jika tidak ada Provider di atasnya |

Dalam kasus ini, `null` digunakan sebagai default karena nilai sebenarnya akan disediakan oleh Provider.

---

## Cara Penggunaan GlobalContext

### 1. Buat Provider Component

```javascript
// GlobalProvider.jsx
import { useState } from 'react';
import { GlobalContext } from './index';

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = {
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};
```

### 2. Wrap App dengan Provider

```javascript
// main.jsx atau App.jsx
import { GlobalProvider } from './components/context/GlobalProvider';

function App() {
  return (
    <GlobalProvider>
      <Header />
      <Main />
      <Footer />
    </GlobalProvider>
  );
}
```

### 3. Consume Context di Component

```javascript
// Cara 1: useContext hook (Recommended)
import { useContext } from 'react';
import { GlobalContext } from '../context';

const UserProfile = () => {
  const { user, isLoggedIn } = useContext(GlobalContext);

  if (!isLoggedIn) return <p>Please login</p>;
  return <p>Welcome, {user.name}!</p>;
};
```

```javascript
// Cara 2: Context.Consumer (Legacy)
import { GlobalContext } from '../context';

const UserProfile = () => {
  return (
    <GlobalContext.Consumer>
      {({ user, isLoggedIn }) => (
        isLoggedIn ? <p>Welcome, {user.name}!</p> : <p>Please login</p>
      )}
    </GlobalContext.Consumer>
  );
};
```

### 4. Custom Hook (Best Practice)

```javascript
// hooks/useGlobal.js
import { useContext } from 'react';
import { GlobalContext } from '../components/context';

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  
  if (!context) {
    throw new Error('useGlobal must be used within GlobalProvider');
  }
  
  return context;
};

// Penggunaan di component
import { useGlobal } from '../hooks/useGlobal';

const MyComponent = () => {
  const { user, setUser } = useGlobal();
  // ...
};
```

---

## File: ThemeContext.jsx

### Overview

ThemeContext mengelola tema aplikasi (light/dark mode) dengan fitur:
- Toggle antara light dan dark mode
- Persistensi ke localStorage
- Deteksi preferensi sistem (OS dark mode)
- Sinkronisasi dengan Tailwind CSS dan DaisyUI

### Exports

| Export | Tipe | Keterangan |
|--------|------|------------|
| `ThemeProvider` | Component | Provider yang membungkus aplikasi |
| `useTheme` | Hook | Custom hook untuk akses theme context |
| `ThemeContext` | Context | Context object (default export) |

### Cara Penggunaan

```javascript
// 1. Wrap App dengan ThemeProvider (di main.jsx)
import { ThemeProvider } from './components/context/ThemeContext';

<ThemeProvider>
  <App />
</ThemeProvider>

// 2. Gunakan useTheme di component manapun
import { useTheme } from './components/context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};
```

### Context Value

```javascript
{
  theme: 'light' | 'dark',     // Tema saat ini
  setTheme: (theme) => void,   // Set tema langsung
  toggleTheme: () => void,     // Toggle light ↔ dark
  isDark: boolean              // Helper: true jika dark mode
}
```

---

## Konsep React Context

### Kapan Menggunakan Context?

✅ **Gunakan Context untuk:**
- Theme (light/dark mode)
- User authentication state
- Language/locale settings
- Global UI state (sidebar open/close)

❌ **Jangan gunakan Context untuk:**
- State yang sering berubah (performance issue)
- State yang hanya dibutuhkan 1-2 level component
- Data yang bisa di-fetch ulang dengan mudah

### Context vs Props vs State Management

| Metode | Use Case | Kompleksitas |
|--------|----------|--------------|
| Props | Data 1-2 level | Simple |
| Context | Data global, jarang berubah | Medium |
| Redux/Zustand | State kompleks, sering berubah | Complex |

### Performance Consideration

Context akan re-render semua consumer saat value berubah. Untuk optimasi:

```javascript
// ❌ Bad: Object baru setiap render
<Context.Provider value={{ user, setUser }}>

// ✅ Good: Memoize value
const value = useMemo(() => ({ user, setUser }), [user]);
<Context.Provider value={value}>
```

---

## Diagram Alur

```
┌─────────────────────────────────────────────────────────┐
│                        App                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              ThemeProvider                       │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │  state: { theme: 'dark' }               │    │    │
│  │  │  functions: toggleTheme, setTheme       │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  │                      │                           │    │
│  │                      ▼ (context value)           │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │              Header                      │    │    │
│  │  │  └── ThemeSwitcher (useTheme)           │    │    │
│  │  ├─────────────────────────────────────────┤    │    │
│  │  │              Main                        │    │    │
│  │  │  └── Components (useTheme)              │    │    │
│  │  ├─────────────────────────────────────────┤    │    │
│  │  │              Footer                      │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Best Practices

1. **Pisahkan Context berdasarkan domain** - Jangan gabung semua state ke satu context

2. **Buat Custom Hook** - Lebih mudah digunakan dan bisa tambah error handling

3. **Gunakan TypeScript** - Untuk type safety pada context value

4. **Memoize value** - Hindari re-render yang tidak perlu

5. **Default value yang bermakna** - Atau throw error jika digunakan tanpa Provider

