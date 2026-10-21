import { useSyncExternalStore } from 'react';

const read = () => (typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light') ? 'light' : 'dark');

const subscribe = (onChange) => {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
};

/*
 * Current site theme ('light' | 'dark'), kept in sync with the class the theme toggle sets on <html>.
 * useSyncExternalStore re-renders synchronously, so theme-dependent demos are already updated when
 * the theme toggle's view transition takes its snapshot (no flash once the transition ends).
 */
export default function useSiteTheme() {
    return useSyncExternalStore(subscribe, read, () => 'dark');
}
