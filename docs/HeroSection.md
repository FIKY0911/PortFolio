# HeroSection Component

**File:** `frontend/src/components/home/HeroSection.jsx`

## Deskripsi
Komponen untuk menampilkan hero section di homepage dengan profile image, typing animation, dan CTA buttons.

## Fitur
- ✅ Profile image dengan loading state
- ✅ Typing animation dengan `react-type-animation`
- ✅ Multi-language support
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Gradient effects

## Struktur Component

### State Management
```javascript
const [imageLoaded, setImageLoaded] = useState(false)
```
- Track apakah image sudah selesai load
- Untuk menampilkan loading skeleton

### Data Fetching
```javascript
const { data: profile, loading: apiLoading } = useApi('/profile')
```
- Fetch profile data dari API
- Data: name, image_url

### Translation
```javascript
const { t, i18n } = useTranslation()
```
- `t()` - Function untuk translate text
- `i18n.language` - Bahasa aktif (id/en)

## Typing Animation

### Dynamic Sequence
```javascript
const typingSequence = i18n.language === 'id'
  ? [
      'Halo, Saya Fiky!☺️', 2000,
      'Selamat Datang di Portofolio Saya!', 2000,
      'Student | Web Developer🧑‍💻', 2000,
      'Antusias | CyberSecurity', 2000,
    ]
  : [
      'Hi, I am Fiky!☺️', 2000,
      'Welcome to My Portfolio!', 2000,
      'Student | Web Developer🧑‍💻', 2000,
      'Enthusiast | CyberSecurity', 2000,
    ]
```

**Format:**
- String pertama: Text yang ditampilkan
- Number: Delay dalam milliseconds (2000 = 2 detik)

### TypeAnimation Component
```javascript
<TypeAnimation
  key={i18n.language}           // Re-render saat bahasa berubah
  sequence={typingSequence}
  wrapper='div'
  cursor={true}                 // Tampilkan cursor
  repeat={Infinity}             // Loop terus
  className='text-3xl...'
  style={{ whiteSpace: 'pre-line' }}
/>
```

## Loading States

### API Loading
```javascript
const loading = apiLoading || (profile?.image_url && !imageLoaded)
```
- Loading jika API masih fetch ATAU image belum load

### Loading Skeleton
```javascript
{loading ? (
  <div className='animate-pulse'>
    <div className='h-12 bg-white/20 rounded-lg mb-6 w-full' />
    <div className='h-12 bg-white/20 rounded-lg mb-15 w-3/4' />
    {/* ... */}
  </div>
) : (
  // Actual content
)}
```

## Image Handling

### Image Container
```javascript
<div className='gradient-border relative w-75 h-80...'>
  {loading && (
    <div className='absolute inset-0 bg-white/20 animate-pulse z-10' />
  )}
  
  {profile?.image_url && (
    <img
      src={profile.image_url}
      alt={profile.name || 'Profile Image'}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageLoaded(true)}
      className={`transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
    />
  )}
</div>
```

**Flow:**
1. Show loading skeleton
2. Image mulai load
3. `onLoad` triggered → `setImageLoaded(true)`
4. Fade in image dengan transition opacity

## Dark Mode Effects

### Glow Effects (Dark Mode Only)
```javascript
<div className='hidden dark:block absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl' />
<div className='hidden dark:block absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl' />
```

- `hidden dark:block` - Hanya tampil di dark mode
- `blur-3xl` - Blur effect untuk glow
- `bg-blue-500/20` - Blue dengan opacity 20%

## CTA Buttons

### View Projects Button
```javascript
<Link to='/projects'>
  <Button className='w-full'>{t('hero.viewProjects')}</Button>
</Link>
```

### Download CV Button
```javascript
<Link
  to='/'
  className='w-full font-semibold px-6 py-3 rounded-lg border-2 border-white bg-transparent text-white hover:bg-white/10 hover:bg-gradient-to-br from-blue-400 to-cyan-400 transition'
>
  {t('hero.downloadCV')}
</Link>
```

## Responsive Design

### Layout
```javascript
<div className='flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16'>
  {/* Image - Order 1 di mobile, Order 2 di desktop */}
  <div className='order-1 lg:order-2'>
    {/* Profile Image */}
  </div>
  
  {/* Text - Order 2 di mobile, Order 1 di desktop */}
  <div className='order-2 lg:order-1'>
    {/* Text Content */}
  </div>
</div>
```

### Breakpoints
- Mobile: Stack vertical (flex-col)
- Desktop (lg): Side by side (flex-row)
- Image di kanan, text di kiri (desktop)

## Styling Classes

### Background Gradient
```javascript
className='bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-gray-900 dark:to-gray-900'
```
- Light mode: Blue to cyan gradient
- Dark mode: Gray gradient

### Text Alignment
```javascript
className='text-center lg:text-left'
```
- Mobile: Center
- Desktop: Left align

## Translation Keys

```javascript
t('hero.description')      // Deskripsi profile
t('hero.viewProjects')     // Text button "Lihat Proyek"
t('hero.downloadCV')       // Text button "Download CV"
```

## Performance Optimization

### Image Lazy Loading
- Image hanya load saat component render
- Loading state untuk UX yang baik

### Animation Key
```javascript
<TypeAnimation key={i18n.language} ... />
```
- Re-mount component saat bahasa berubah
- Typing animation restart dengan text baru

### Conditional Rendering
- Hanya render content yang diperlukan
- Loading skeleton saat data belum ready

## Contoh Penggunaan

```javascript
import HeroSection from './components/home/HeroSection'

function HomePage() {
  return (
    <div>
      <HeroSection />
      {/* Other sections */}
    </div>
  )
}
```
