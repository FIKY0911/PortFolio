/**
 * ============================================================================
 * App.jsx - Root Component Aplikasi
 * ============================================================================
 * 
 * PEMBELAJARAN SENIOR DEVELOPER:
 * 
 * 1. ROOT COMPONENT PATTERN
 *    - Komponen tertinggi dalam hierarchy aplikasi
 *    - Bertanggung jawab untuk routing setup
 *    - Minimal logic, fokus pada structure
 * 
 * 2. REACT ROUTER V6
 *    - RouterProvider: Component untuk provide router ke app
 *    - router object dibuat di file terpisah (separation of concerns)
 *    - Menggunakan data router API (createBrowserRouter)
 * 
 * 3. SUSPENSE & LAZY LOADING
 *    - Suspense: React feature untuk handle async operations
 *    - fallback: Component yang ditampilkan saat loading
 *    - SkeletonLoading: Loading state yang user-friendly
 *    - Meningkatkan perceived performance
 * 
 * 4. CODE SPLITTING STRATEGY
 *    - Router-level splitting (di router.jsx)
 *    - Component-level splitting (lazy import)
 *    - Mengurangi initial bundle size
 *    - Faster initial page load
 * 
 * 5. SEPARATION OF CONCERNS
 *    - Routing logic → router.jsx
 *    - App component → hanya setup
 *    - Business logic → individual pages/components
 * 
 * BEST PRACTICES:
 * - Keep App.jsx simple dan clean
 * - Jangan tambahkan state management di sini
 * - Jangan tambahkan business logic
 * - Gunakan Suspense untuk better UX saat loading
 * 
 * TIPS UNTUK JUNIOR:
 * - App.jsx adalah "orchestrator", bukan "worker"
 * - Suspense boundary melindungi app dari crash saat lazy load
 * - fallback harus lightweight (jangan load heavy component)
 */

import './index.css'
import { Suspense, useEffect } from 'react'
import { router } from './routers/router'
import { RouterProvider } from 'react-router-dom'
import { SkeletonLoading } from './components/loading/SkeletonLoading'
import { useDataStore } from './store/dataStore'

function App() {
  useEffect(() => {
    useDataStore.getState().fetchAll()
  }, [])

  return (
    <div>
      {/* Suspense boundary untuk handle lazy loading routes */}
      <Suspense fallback={<SkeletonLoading />}>
        {/* RouterProvider menyediakan routing context ke seluruh app */}
        <RouterProvider router={router} />
      </Suspense>
    </div>
  )
}

export default App
