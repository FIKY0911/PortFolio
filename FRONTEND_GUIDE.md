# Frontend Guide - Portfolio (React + Vite)

Dokumentasi lengkap untuk frontend Portfolio menggunakan React 19, Vite, dan Tailwind CSS.

---

## Persyaratan Sistem

| Software | Versi | Keterangan |
|----------|-------|------------|
| Node.js | >= 18 | JavaScript runtime |
| npm/yarn | Latest | Package manager |

---

## Langkah Instalasi

```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Setup environment variables
# Edit file .env

# 4. Jalankan development server
npm run dev
```

Server berjalan di `http://localhost:5173`

---

## Environment Variables (.env)

```env
# Backend API URL
VITE_BASE_URL=http://localhost:8000

# EmailJS untuk Contact Form
VITE_SERVICE_ID=service_xxxxx
VITE_TEMPLATE_ID=template_xxxxx
VITE_PUBLIC_KEY=xxxxxxxxxxxxx
```

> **Penting:** Semua env variable di Vite HARUS diawali dengan `VITE_`

---

## Dependencies (package.json)

### Production Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| `react` | ^19.2.1 | Library UI utama |
| `react-dom` | ^19.2.1 | React DOM renderer |
| `react-router-dom` | ^7.9.5 | Routing/navigasi SPA |
| `axios` | ^1.13.2 | HTTP client (alternatif fetch) |
| `tailwindcss` | ^4.1.16 | CSS framework utility-first |
| `daisyui` | ^5.4.4 | Component library untuk Tailwind |
| `animate.css` | ^4.1.1 | Library animasi CSS |
| `remixicon` | ^4.7.0 | Icon library |
| `react-type-animation` | ^3.2.0 | Animasi typing text |
| `react-intersection-observer` | ^10.0.0 | Detect element di viewport |
| `@emailjs/browser` | ^4.4.1 | Kirim email dari browser |

### Dev Dependencies

| Package | Fungsi |
|---------|--------|
| `vite` | Build tool & dev server |
| `@vitejs/plugin-react` | Vite plugin untuk React |
| `eslint` | Linter untuk code quality |
| `autoprefixer` | CSS vendor prefixes |

---

## Struktur Folder

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API configuration
│   │   └── Api.js
│   ├── assets/            # Images, icons
│   │   ├── hero/
│   │   ├── project/
│   │   └── tools/
│   ├── components/        # Reusable components
│   │   ├── header/
│   │   │   ├── Header.jsx
│   │   │   └── fragments/
│   │   │       ├── Logo.jsx
│   │   │       └── Navbar.jsx
│   │   ├── footer/
│   │   │   └── Footer.jsx
│   │   ├── home/
│   │   │   └── HeroSection.jsx
│   │   ├── skill/
│   │   │   ├── SkillDetail.jsx
│   │   │   └── fragments/
│   │   │       └── Card.jsx
│   │   ├── loading/
│   │   │   └── SkeletonLoading.jsx
│   │   ├── Button.jsx
│   │   ├── Container.jsx
│   │   └── ErrorPage.jsx
│   ├── layouts/
│   │   └── RootLayout.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Skill.jsx
│   │   ├── Project.jsx
│   │   └── Contact.jsx
│   ├── routers/
│   │   └── router.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
└── vite.config.js
```

---

## Penjelasan File Utama

### 1. main.jsx - Entry Point

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'           // Tailwind CSS
import 'animate.css';          // Library animasi
import 'remixicon/fonts/remixicon.css';  // Icon library
import App from './App.jsx'

// createRoot: React 18+ API untuk render
// document.getElementById('root'): Target element di index.html
createRoot(document.getElementById('root')).render(
  // StrictMode: Development tool untuk detect masalah
  // Akan render component 2x di development (normal behavior)
  <StrictMode>
      <App />
  </StrictMode>,
)
```

**Fungsi:**
- Entry point aplikasi React
- Import global CSS dan libraries
- Render `<App />` ke DOM

---

### 2. App.jsx - Root Component

```jsx
import { Suspense } from 'react'
import { router } from './routers/router'
import { RouterProvider } from 'react-router-dom'
import { SkeletonLoading } from './components/loading/SkeletonLoading'

function App() {
  return (
    <div>
      {/* Suspense: Wrapper untuk lazy loading */}
      {/* fallback: Component yang tampil saat loading */}
      <Suspense fallback={<SkeletonLoading />}>
        {/* RouterProvider: Menyediakan routing ke seluruh app */}
        <RouterProvider router={router}/>
      </Suspense>
    </div>
  )
}

export default App
```

**Fungsi:**
- Root component yang membungkus seluruh aplikasi
- Setup routing dengan `RouterProvider`
- `Suspense` untuk handle lazy loading components

---

### 3. router.jsx - Routing Configuration

```jsx
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../components/ErrorPage"
// ... import pages

// createBrowserRouter: Membuat router dengan browser history API
export const router = createBrowserRouter([
  {
    path: "/",                    // Base path
    element: <RootLayout/>,       // Layout wrapper (Header + Footer)
    errorElement: <ErrorPage />,  // Tampil saat error/404
    children: [                   // Nested routes
      {
        path: "/",                // localhost:5173/
        element: <Home />
      },
      {
        path: "/about",           // localhost:5173/about
        element: <About />
      },
      {
        path: "/skill",           // localhost:5173/skill
        element: <Skill />
      },
      {
        path: "/skill/:id",       // localhost:5173/skill/1 (dynamic)
        element: <SkillDetail/>   // :id = parameter dinamis
      },
      {
        path: "/project",
        element: <Project />
      },
      {
        path: "/contact",
        element: <Contact/>
      }
    ]
  }
])
```

**Fungsi:**
- Definisi semua routes aplikasi
- Nested routing dengan `children`
- Dynamic route dengan `:id` parameter
- Error handling dengan `errorElement`

---

### 4. RootLayout.jsx - Layout Wrapper

```jsx
import Header from '../components/header/Header'
import { Outlet } from 'react-router-dom'
import Container from '../components/Container'
import Footer from '../components/footer/Footer'

const RootLayout = () => {
  return (
    <div>
      <header>
        <nav>
          <Header/>  {/* Navigation bar */}
        </nav>
      </header>
      <main>
        <Container>
          {/* Outlet: Tempat render child routes */}
          {/* Contoh: /about akan render <About/> di sini */}
          <Outlet/>
        </Container>
        <div className='pt-20'>
          <Footer/>
        </div>
      </main>
    </div>
  )
}
```

**Fungsi:**
- Layout yang membungkus semua halaman
- Header dan Footer selalu tampil
- `<Outlet/>` adalah placeholder untuk child routes

---

## Penjelasan Components

### 5. HeroSection.jsx - Hero dengan API Fetch

Component utama di homepage yang fetch data profile dari backend.

```jsx
// STATE MANAGEMENT
const [profile, setProfile] = useState(null)     // Data dari API
const [loading, setLoading] = useState(true)     // Loading gabungan
const [apiLoaded, setApiLoaded] = useState(false)   // API selesai?
const [imageLoaded, setImageLoaded] = useState(false) // Image selesai?
```

**State Explanation:**
| State | Type | Fungsi |
|-------|------|--------|
| `profile` | object/null | Menyimpan data profile dari API |
| `loading` | boolean | Status loading gabungan (API + image) |
| `apiLoaded` | boolean | Apakah API fetch sudah selesai |
| `imageLoaded` | boolean | Apakah image sudah di-load browser |

**Fetch dengan Retry Mechanism:**
```jsx
useEffect(() => {
  const abortController = new AbortController()
  const baseUrl = import.meta.env.VITE_BASE_URL
  
  const maxRetries = 3      // Maksimal 3x percobaan
  const retryDelay = 1000   // Delay 1 detik
  
  const fetchWithRetry = async (retryCount = 0) => {
    try {
      const response = await fetch(`${baseUrl}/api/profile`, {
        signal: abortController.signal  // Untuk cancel request
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status && data.data) {
        setProfile(data.data)
      }
      
      setApiLoaded(true)
      
    } catch (error) {
      if (error.name === 'AbortError') return  // Ignore abort
      
      if (retryCount < maxRetries) {
        // Retry setelah delay
        setTimeout(() => fetchWithRetry(retryCount + 1), retryDelay)
      } else {
        setApiLoaded(true)  // Stop loading meski gagal
      }
    }
  }
  
  fetchWithRetry()
  
  // Cleanup: Cancel request saat unmount
  return () => abortController.abort()
}, [])
```

**Kenapa pakai AbortController?**
- React StrictMode render 2x di development
- Tanpa abort, bisa terjadi double fetch
- Mencegah memory leak saat component unmount

**Loading State Gabungan:**
```jsx
useEffect(() => {
  // Loading selesai HANYA jika API DAN image sudah loaded
  if (apiLoaded && imageLoaded) {
    setLoading(false)
  }
}, [apiLoaded, imageLoaded])
```

**Image dengan Lazy Loading:**
```jsx
<img
  src={profile.image_url}
  alt={profile.name}
  onLoad={() => setImageLoaded(true)}   // Trigger saat image loaded
  onError={(e) => console.error('Failed:', e)}
  className={`transition-opacity duration-500 ${
    imageLoaded ? 'opacity-100' : 'opacity-0'  // Fade-in effect
  }`}
/>
```

---

### 6. Card.jsx (Skills) - Grid dengan Animasi

Component untuk menampilkan grid skills dari API.

**AnimatedCard - Individual Card:**
```jsx
const AnimatedCard = ({ skill, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  // useInView: Detect kapan element masuk viewport
  const { ref, inView } = useInView({
    triggerOnce: true,   // Hanya trigger sekali
    threshold: 0.1,      // Trigger saat 10% terlihat
  })

  // Delay animasi berdasarkan index (stagger effect)
  const animationDelay = `${index * 100}ms`

  return (
    <Link
      ref={ref}  // Attach ref untuk intersection observer
      to={`/skill/${skill.id}`}
      // Conditional class: animasi hanya jika inView = true
      className={`block ${inView ? 'animate__animated animate__fadeInRight' : ''}`}
      style={{ animationDelay }}
    >
      {/* Card content */}
    </Link>
  )
}
```

**useInView Hook:**
- Dari library `react-intersection-observer`
- Detect kapan element masuk viewport
- `triggerOnce: true` = animasi hanya sekali
- `threshold: 0.1` = trigger saat 10% element terlihat

**Stagger Animation:**
```jsx
const animationDelay = `${index * 100}ms`
// index 0 = 0ms delay
// index 1 = 100ms delay
// index 2 = 200ms delay
// Efek: cards muncul satu per satu
```

**Card Component - Container:**
```jsx
const Card = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch dengan retry (sama seperti HeroSection)
    const fetchWithRetry = async (retryCount = 0) => {
      // ... fetch logic
    }
    fetchWithRetry()
  }, [])

  return (
    <div>
      {loading ? (
        // Skeleton loading - 8 placeholder cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              {/* Skeleton structure */}
            </div>
          ))}
        </div>
      ) : (
        // Actual content
        skills.length > 0 ? (
          <div className="grid ...">
            {skills.map((skill, index) => (
              <AnimatedCard key={skill.id} skill={skill} index={index} />
            ))}
          </div>
        ) : (
          // Empty state
          <p>No skills available</p>
        )
      )}
    </div>
  )
}
```

**Skeleton Loading Pattern:**
```jsx
// [...Array(8)] = Buat array dengan 8 element undefined
// .map((_, index) => ...) = Loop 8x untuk render skeleton
{[...Array(8)].map((_, index) => (
  <div key={index} className="animate-pulse">
    <div className="h-12 bg-gray-300 rounded"></div>
  </div>
))}
```

---

### 7. Project.jsx - Project Cards dengan GitHub Link

```jsx
const AnimatedProjectCard = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <div ref={ref} className={`... ${inView ? 'animate__animated animate__fadeInUp' : ''}`}>
      {/* Image dengan lazy loading */}
      <div className='relative'>
        {/* Skeleton overlay */}
        {!imageLoaded && project.image_url && (
          <div className='absolute inset-0 bg-gray-200 animate-pulse'></div>
        )}
        
        {project.image_url ? (
          <img
            src={project.image_url}
            onLoad={() => setImageLoaded(true)}
            className={`transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div>No Image</div>
        )}
      </div>

      {/* Tools/Tech Stack - Render array */}
      {project.tools && project.tools.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {project.tools.map((tool, id) => (
            <span key={id} className='px-2 py-1 bg-slate-100 rounded-full'>
              {tool}
            </span>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className='flex gap-3'>
        {/* Conditional render: hanya tampil jika URL ada */}
        {project.referance_url && (
          <Button onClick={() => window.open(project.referance_url, '_blank')}>
            Lihat Project
          </Button>
        )}
        
        {project.github_url && (
          <button onClick={() => window.open(project.github_url, '_blank')}>
            <i className="ri-github-fill"></i>  {/* Remix Icon */}
            GitHub
          </button>
        )}
      </div>
    </div>
  )
}
```

**Conditional Rendering:**
```jsx
// Render hanya jika kondisi true
{project.github_url && (
  <button>GitHub</button>
)}

// Sama dengan:
{project.github_url ? <button>GitHub</button> : null}
```

**window.open():**
```jsx
window.open(url, '_blank', 'noopener,noreferrer')
// '_blank' = buka di tab baru
// 'noopener,noreferrer' = security best practice
```

---

### 8. Contact.jsx - Form dengan EmailJS

```jsx
import emailjs from '@emailjs/browser'

const Contact = () => {
  const from = useRef()  // Reference ke form element
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()  // Prevent page reload

    // Ambil credentials dari .env
    const serviceId = import.meta.env.VITE_SERVICE_ID
    const templateId = import.meta.env.VITE_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_PUBLIC_KEY

    // Data yang dikirim ke EmailJS template
    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: 'Fiky',
      message: message,
    }

    // Kirim email via EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((res) => {
        alert('Email berhasil terkirim')
        // Reset form
        setName('')
        setEmail('')
        setMessage('')
      })
      .catch((err) => {
        alert('Email gagal terkirim')
      })
  }

  return (
    <form onSubmit={handleSubmit} ref={from}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}  // Controlled input
      />
      {/* ... other inputs */}
      <Button type="submit">Kirim Pesan</Button>
    </form>
  )
}
```

**Controlled vs Uncontrolled Input:**
```jsx
// Controlled: React mengontrol value
<input value={name} onChange={(e) => setName(e.target.value)} />

// Uncontrolled: DOM mengontrol value (pakai ref)
<input ref={inputRef} />
```

**EmailJS Flow:**
1. User isi form → state terupdate
2. Submit → `handleSubmit()` dipanggil
3. `e.preventDefault()` mencegah reload
4. `emailjs.send()` kirim ke EmailJS server
5. EmailJS forward ke email tujuan

---

### 9. Header.jsx - Responsive Navigation

```jsx
const Header = () => {
  const [scrolled, setScrolled] = useState(false)      // Detect scroll
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)  // Mobile menu state

  // Effect: Detect scroll untuk ubah header style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll)
    // Cleanup: remove listener saat unmount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Effect: Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false)
    }
    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  return (
    <>
      {/* Overlay: Background gelap saat mobile menu terbuka */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 bg-black/30 z-40 lg:hidden'></div>
      )}

      {/* Header dengan conditional styling */}
      <header className={`fixed top-0 ... ${
        scrolled ? 'bg-slate-400/90 shadow-md' : 'bg-white shadow-md'
      }`}>
        <Logo />
        
        {/* Desktop: Navbar selalu tampil */}
        <div className='hidden lg:block'>
          <Navbar />
        </div>

        {/* Mobile: Hamburger button */}
        {!mobileMenuOpen && (
          <button onClick={toggleMobileMenu}>
            <i className='ri-menu-3-line'></i>
          </button>
        )}
      </header>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <div className='fixed top-0 right-0 h-full w-4/5 bg-white z-50'>
          <button onClick={() => setMobileMenuOpen(false)}>
            <i className='ri-close-line'></i>
          </button>
          <Navbar onLinkClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  )
}
```

**Responsive Pattern:**
```jsx
// Desktop only (hidden di mobile)
<div className='hidden lg:block'>
  <Navbar />
</div>

// Mobile only (hidden di desktop)
<button className='lg:hidden'>
  Menu
</button>
```

**Scroll Detection:**
```jsx
useEffect(() => {
  const handleScroll = () => {
    // scrollY > 8 = sudah scroll lebih dari 8px
    setScrolled(window.scrollY > 8)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

---

### 10. Button.jsx - Reusable Button Component

```jsx
const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`group inline-flex items-center justify-center px-6 py-3 
        font-medium rounded-xl relative overflow-hidden
        bg-slate-100 dark:bg-gray-700           // Background: light/dark mode
        shadow shadow-slate-300 dark:shadow-gray-900  // Shadow sesuai mode
        border border-transparent dark:border-gray-600
        transition-all duration-300 ease-out
        hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-400
        hover:ring-2 hover:ring-cyan-300/70
        dark:hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]  // Glow HANYA di dark mode
        cursor-pointer
        ${className}`}
      {...props}
    >
      {/* Text dengan gradient - tampil saat normal */}
      <span className="bg-gradient-to-br from-cyan-400 to-blue-400 
                      bg-clip-text text-transparent
                      group-hover:opacity-0 transition-opacity">
        {children}
      </span>

      {/* Text solid - tampil saat hover */}
      <span className="text-slate-100 absolute opacity-0 
                      group-hover:opacity-100 transition-opacity">
        {children}
      </span>
    </button>
  )
}
```

**Props Explanation:**
| Prop | Type | Fungsi |
|------|------|--------|
| `children` | ReactNode | Content di dalam button |
| `className` | string | Custom CSS classes |
| `...props` | any | Props lain (onClick, type, disabled, dll) |

**Group Hover Pattern:**
```jsx
// Parent dengan class 'group'
<button className="group">
  {/* Child bereaksi saat parent di-hover */}
  <span className="group-hover:opacity-0">Normal</span>
  <span className="group-hover:opacity-100">Hover</span>
</button>
```

---

## Konsep Penting

### 1. useState - State Management

```jsx
// Syntax: const [value, setValue] = useState(initialValue)
const [count, setCount] = useState(0)

// Update state
setCount(5)           // Set langsung
setCount(prev => prev + 1)  // Update berdasarkan nilai sebelumnya
```

**Rules:**
- State update adalah async (tidak langsung berubah)
- Jangan mutate state langsung: `count = 5` ❌
- Gunakan setter function: `setCount(5)` ✅

### 2. useEffect - Side Effects

```jsx
// Jalan sekali saat mount
useEffect(() => {
  console.log('Component mounted')
}, [])

// Jalan setiap kali dependency berubah
useEffect(() => {
  console.log('Count changed:', count)
}, [count])

// Cleanup function
useEffect(() => {
  const timer = setInterval(() => {}, 1000)
  return () => clearInterval(timer)  // Cleanup saat unmount
}, [])
```

**Dependency Array:**
| Dependency | Behavior |
|------------|----------|
| `[]` | Jalan sekali saat mount |
| `[count]` | Jalan saat `count` berubah |
| Tidak ada | Jalan setiap render |

### 3. Conditional Rendering

```jsx
// && operator (short-circuit)
{isLoggedIn && <Dashboard />}

// Ternary operator
{isLoading ? <Spinner /> : <Content />}

// Multiple conditions
{status === 'loading' && <Spinner />}
{status === 'error' && <Error />}
{status === 'success' && <Content />}
```

### 4. List Rendering

```jsx
// Array.map() untuk render list
{items.map((item) => (
  <div key={item.id}>  {/* key wajib untuk performance */}
    {item.name}
  </div>
))}

// Dengan index (jika tidak ada unique id)
{items.map((item, index) => (
  <div key={index}>{item}</div>
))}
```

### 5. Event Handling

```jsx
// onClick
<button onClick={() => handleClick()}>Click</button>
<button onClick={handleClick}>Click</button>  // Tanpa argument

// onChange (untuk input)
<input onChange={(e) => setValue(e.target.value)} />

// onSubmit (untuk form)
<form onSubmit={(e) => {
  e.preventDefault()  // Prevent page reload
  handleSubmit()
}}>
```

### 6. Props

```jsx
// Parent component
<Card title="Hello" count={5} onClick={handleClick} />

// Child component
const Card = ({ title, count, onClick }) => {
  return (
    <div onClick={onClick}>
      <h1>{title}</h1>
      <p>Count: {count}</p>
    </div>
  )
}

// Default props
const Card = ({ title = 'Default Title' }) => { ... }

// Spread props
const Card = ({ className, ...props }) => {
  return <div className={className} {...props} />
}
```

---

## Tailwind CSS Patterns

### Responsive Design
```jsx
// Mobile first approach
<div className="
  text-sm      // Default (mobile)
  sm:text-base // >= 640px
  md:text-lg   // >= 768px
  lg:text-xl   // >= 1024px
  xl:text-2xl  // >= 1280px
">
```

### Flexbox
```jsx
<div className="flex items-center justify-between gap-4">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### Hover & Transitions
```jsx
<button className="
  bg-blue-500 
  hover:bg-blue-600 
  transition-colors 
  duration-300
">
```

### Gradient Text
```jsx
<h1 className="
  bg-gradient-to-r from-blue-600 to-cyan-500 
  bg-clip-text 
  text-transparent
">
  Gradient Text
</h1>
```

---

## API Integration Pattern

### Fetch dengan Retry

```jsx
const fetchWithRetry = async (url, retryCount = 0, maxRetries = 3) => {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return await response.json()
    
  } catch (error) {
    if (retryCount < maxRetries) {
      // Wait 1 second then retry
      await new Promise(resolve => setTimeout(resolve, 1000))
      return fetchWithRetry(url, retryCount + 1, maxRetries)
    }
    throw error
  }
}
```

### AbortController untuk Cancel Request

```jsx
useEffect(() => {
  const controller = new AbortController()
  
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err)
      }
    })
  
  // Cleanup: cancel request saat unmount
  return () => controller.abort()
}, [])
```

### Loading States Pattern

```jsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  setError(null)
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      setData(data)
      setLoading(false)
    })
    .catch(err => {
      setError(err.message)
      setLoading(false)
    })
}, [])

// Render
if (loading) return <Skeleton />
if (error) return <Error message={error} />
if (!data) return <Empty />
return <Content data={data} />
```

---

## Troubleshooting

### CORS Error
```
Access to fetch at 'http://localhost:8000/api/...' has been blocked by CORS
```
**Solusi:** Pastikan backend sudah setup CORS untuk allow frontend origin.

### Double Fetch di Development
**Penyebab:** React StrictMode render 2x
**Solusi:** Gunakan AbortController (sudah diimplementasi)

### Image tidak muncul
1. Cek URL di Network tab browser
2. Pastikan backend sudah `php artisan storage:link`
3. Cek `VITE_BASE_URL` di `.env`

### Environment Variable tidak terbaca
1. Pastikan prefix `VITE_`
2. Restart dev server setelah ubah `.env`

### Animasi tidak jalan
1. Pastikan `animate.css` sudah di-import di `main.jsx`
2. Cek class name: `animate__animated animate__fadeIn`

---

## Commands

```bash
# Development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint
```

---

## Best Practices

1. **Component kecil dan fokus** - Satu component, satu tanggung jawab
2. **Gunakan loading states** - Skeleton lebih baik dari spinner
3. **Handle error** - Selalu ada fallback untuk error
4. **Cleanup effects** - Return cleanup function di useEffect
5. **Key untuk list** - Selalu gunakan unique key saat map
6. **Controlled inputs** - Gunakan state untuk form inputs
7. **Environment variables** - Jangan hardcode credentials
8. **Responsive design** - Mobile first dengan Tailwind
