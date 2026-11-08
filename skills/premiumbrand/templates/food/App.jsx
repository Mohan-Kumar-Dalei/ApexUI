import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScroll, scrollToId } from './lib/motion.jsx';
import { useStore } from './lib/store.jsx';
import Loader from './components/Loader.jsx';
import Nav, { Frame } from './components/Nav.jsx';
import BagDrawer from './components/BagDrawer.jsx';
import Hero from './sections/Hero.jsx';
import Inside, { Storm } from './sections/Inside.jsx';
import { BuildBox, Wall } from './sections/Shop.jsx';
import Rack from './sections/Rack.jsx';
import { Footer, Letter, Questions } from './sections/Closing.jsx';

const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderPage = lazy(() => import('./pages/Order.jsx').then((m) => ({ default: m.OrderPage })));
const TrackPage = lazy(() => import('./pages/Order.jsx').then((m) => ({ default: m.TrackPage })));

function Home() {
    const { hash } = useLocation();
    useEffect(() => {
        if (!hash) return undefined;
        const t = setTimeout(() => scrollToId(hash.slice(1)), 300);
        return () => clearTimeout(t);
    }, [hash]);
    return (
        <main>
            <Hero />
            <Inside />
            <Storm />
            <Wall />
            <BuildBox />
            <Rack />
            <Questions />
            <Letter />
        </main>
    );
}

function Toast() {
    const { toast, setBagOpen } = useStore();
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4" role="status" aria-live="polite">
            {toast && (
                <div key={toast.id} className="pointer-events-auto flex animate-[toast_.5s_var(--ease-expo)] items-center gap-4 rounded-full bg-ink py-2 pl-5 pr-2 text-[14px] font-semibold text-bg shadow-xl">
                    {toast.text}
                    {toast.text.includes('bag') && (
                        <button onClick={() => setBagOpen(true)} className="rounded-full bg-sun px-4 py-1.5 text-[13px] font-bold text-ink">
                            View bag
                        </button>
                    )}
                </div>
            )}
            <style>{`@keyframes toast { from { transform: translateY(24px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
        </div>
    );
}

export default function App() {
    const [ready, setReady] = useState(false);
    const { catalogue } = useStore();
    useEffect(() => {
        const on = () => {
            document.documentElement.dataset.revealed = '1';
            setTimeout(() => ScrollTrigger.refresh(), 200);
        };
        window.addEventListener('lays:revealed', on);
        return () => window.removeEventListener('lays:revealed', on);
    }, []);
    return (
        <>
            <SmoothScroll />
            {!ready && (
                <Loader
                    onDone={() => {
                        // the loader announces the reveal mid-lift; reduced motion skips that
                        if (!document.documentElement.dataset.revealed) window.dispatchEvent(new Event('lays:revealed'));
                        setReady(true);
                    }}
                />
            )}
            {catalogue && (
                <>
                    <Nav />
                    <Frame />
                    <Suspense fallback={<div className="min-h-svh" />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order/:number" element={<OrderPage />} />
                            <Route path="/track" element={<TrackPage />} />
                            <Route path="*" element={<Home />} />
                        </Routes>
                    </Suspense>
                    <Footer />
                    <BagDrawer />
                    <Toast />
                </>
            )}
        </>
    );
}
