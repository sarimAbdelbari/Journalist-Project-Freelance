import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ContextProvider } from '@/contexts/ContextProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>

    <BrowserRouter>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider >
    </BrowserRouter>
    </ContextProvider>
  </StrictMode>,
)