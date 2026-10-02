import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './site/styles/theme.css';
import { router } from './site/router.jsx';

// Apply the saved theme before first paint so there is no flash.
try {
    const saved = localStorage.getItem('apexui-theme');
    document.documentElement.classList.add(saved === 'light' ? 'theme-light' : 'theme-dark');
} catch {
    document.documentElement.classList.add('theme-dark');
}

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
