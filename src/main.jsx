import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './components/css/style.css'
import App from './App.jsx'
import SidebarProvider from '../src/router/context/SidebarProvider.jsx';
import { Toaster } from 'sonner';
import './components/MainUI/ApexUI-Kit/ThemeToggle/ThemeToggle.css'
createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
        <SidebarProvider>
          <Toaster
            richColors
            closeButton
          />
          <App />
        </SidebarProvider>
    </BrowserRouter>
  </>
)
