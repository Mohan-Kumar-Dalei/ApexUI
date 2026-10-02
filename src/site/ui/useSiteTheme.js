import { useEffect, useState } from 'react';

const read = () => (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light') ? 'light' : 'dark');

/* Current site theme ('light' | 'dark'), kept in sync with the class the theme toggle sets on <html>. */
export default function useSiteTheme() {
    const [theme, setTheme] = useState(read);
    useEffect(() => {
        const observer = new MutationObserver(() => setTheme(read()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    return theme;
}
