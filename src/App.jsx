import './index.css'
import { Suspense } from 'react'
import { router } from './routers/router'
import { RouterProvider } from 'react-router-dom'
import { SkeletonLoading } from './components/loading/SkeletonLoading'

function App() {
  return (
    <div>
      <Suspense fallback={<SkeletonLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  )
}

export default App
