import './index.css'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routers/router'

function App() {

  return (
    <div>
      <Suspense fallback={<p>Loadig app...</p>}>
        <RouterProvider router={router}/>
      </Suspense>
    </div>
  )
}

export default App
