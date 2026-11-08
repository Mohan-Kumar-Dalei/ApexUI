import { lazy, Suspense, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BagDrawer, Footer, Loader, Nav } from './chrome.jsx';
import { AuthProvider, BagProvider, SmoothScroll, WishProvider } from './lib.jsx';
import Home from './pages/Home.jsx';
import { u } from './base.js';

const Shop = lazy(() => import('./pages/Shop.jsx'));
const Product = lazy(() => import('./pages/Product.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderDone = lazy(() => import('./pages/Checkout.jsx').then((m) => ({ default: m.OrderDone })));
const Account = lazy(() => import('./pages/Account.jsx'));
const VideoCall = lazy(() => import('./pages/VideoCall.jsx'));

function NotFound() {
    return (
        <div className="mx-auto max-w-xl px-5 pb-32 pt-40 sm:px-8">
            <h1 className="text-6xl">A loose thread.</h1>
            <p className="mt-4 text-tn-muted">This page is not here. The sarees are.</p>
            <Link to={u('/sarees')} className="mt-8 inline-flex h-12 items-center rounded-full bg-tn-ink px-6 font-medium text-tn-bg">
                See the sarees
            </Link>
        </div>
    );
}

export default function App() {
    const [ready, setReady] = useState(false);
    const { pathname } = useLocation();
    return (
        <AuthProvider>
            <BagProvider>
                <WishProvider>
                <SmoothScroll />
                <Loader onDone={() => setReady(true)} />
                <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-tn-ink focus:px-4 focus:py-2 focus:text-tn-bg">
                    Skip to content
                </a>
                <div className="min-h-dvh overflow-x-clip">
                    <Nav />
                    <motion.main id="main" key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Suspense fallback={<div className="min-h-[80vh]" />}>
                            <Routes>
                                <Route index element={<Home ready={ready} />} />
                                <Route path="sarees" element={<Shop />} />
                                <Route path="saree/:slug" element={<Product />} />
                                <Route path="checkout" element={<Checkout />} />
                                <Route path="order/:orderNo" element={<OrderDone />} />
                                <Route path="account" element={<Account />} />
                                <Route path="video-call" element={<VideoCall />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </motion.main>
                    <Footer />
                </div>
                <BagDrawer />
                </WishProvider>
            </BagProvider>
        </AuthProvider>
    );
}
