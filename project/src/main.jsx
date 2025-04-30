import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ContextProvider } from '@/contexts/ContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>

    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ContextProvider>
  </StrictMode>,
)