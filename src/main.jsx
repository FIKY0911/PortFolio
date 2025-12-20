import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'animate.css'
import 'remixicon/fonts/remixicon.css'
import './i18n' // Import i18n configuration
import App from './App.jsx'
import { ThemeProvider } from './components/context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
)
