import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './components/css/style.css'
import App from './App.jsx'
import SidebarProvider from '../src/router/context/SidebarProvider.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </BrowserRouter>
  </>
)
