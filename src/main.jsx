import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';
import './site/styles/theme.css';
import App from './App.jsx';

// Apply the saved theme before first paint so there is no flash.
try {
    const saved = localStorage.getItem('apexui-theme');
    document.documentElement.classList.add(saved === 'light' ? 'theme-light' : 'theme-dark');
} catch {
    document.documentElement.classList.add('theme-dark');
}

createRoot(document.getElementById('root')).render(
    <>
        <BrowserRouter>
            <Toaster richColors closeButton position="bottom-center" />
            <App />
        </BrowserRouter>
    </>
);
