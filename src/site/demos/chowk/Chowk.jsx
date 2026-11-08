import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BackPill, useFonts } from "../shared.jsx";
import Nav, { TabBar, Wordmark } from "./components/Nav";
import Footer from "./components/Footer";
import { CartBar, ReplaceCartModal } from "./components/CartBar";
import { EASE, Icon } from "./components/ui";
import { StoreProvider } from "./store";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Search from "./pages/Search";
import Offers from "./pages/Offers";
import Checkout from "./pages/Checkout";
import Track from "./pages/Track";
import NotFound from "./pages/NotFound";

/*
 * Chowk, a food delivery app for the kitchens around you.
 * Direction: warm paper and steel tiffins, one chilli terracotta accent, Fraunces with Figtree.
 * Layout: a real app shell (sticky area picker, phone tab bar) with its own routes under /demos/chowk.
 * Architecture: cart, area and orders in a context (store.jsx) saved to localStorage.
 * Loader: the wordmark rises while a rider crosses the line. Skeleton: restaurant cards while kitchens load.
 */

const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Figtree:wght@400;500;600;700&display=swap";

const vars = {
  "--c-bg": "#f7f2e9",
  "--c-surface": "#efe7d8",
  "--c-card": "#fffdf8",
  "--c-ink": "#1e1a16",
  "--c-muted": "#6b6358",
  "--c-line": "#e0d6c4",
  "--c-accent": "#b9441a",
  "--c-accent-ink": "#9a3712",
  "--c-on-accent": "#fff8f0",
  "--c-veg": "#2e7d32",
  "--c-nonveg": "#b3261e",
  "--c-leaf": "#2f5d3a",
};

// Base rules sit in Tailwind's base layer so utilities still win; helpers sit in utilities.
const CSS = `
@layer base {
  .chowk { font-family: "Figtree", system-ui, sans-serif; -webkit-font-smoothing: antialiased; color: var(--c-ink); background: var(--c-bg); }
  .chowk h1, .chowk h2, .chowk h3 { font-family: "Fraunces", Georgia, serif; font-weight: 500; letter-spacing: -0.02em; line-height: 1.05; font-optical-sizing: auto; }
  .chowk ::selection { background: var(--c-accent); color: var(--c-on-accent); }
  .chowk :focus-visible { outline: 2px solid var(--c-accent); outline-offset: 2px; }
  .chowk button { cursor: pointer; }
}
@layer utilities {
  .chowk .ck-display { font-family: "Fraunces", Georgia, serif; }
  .chowk .ck-text { font-family: "Figtree", system-ui, sans-serif; }
  .chowk .tnum { font-variant-numeric: tabular-nums; }
  .chowk .no-scrollbar { scrollbar-width: none; }
  .chowk .no-scrollbar::-webkit-scrollbar { display: none; }
  .chowk .link-line { position: relative; }
  .chowk .link-line::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform .5s cubic-bezier(.16,1,.3,1); }
  .chowk .link-line:hover::after { transform: scaleX(1); }
  .chowk .coupon { position: relative; }
  .chowk .coupon::before, .chowk .coupon::after { content: ""; position: absolute; top: 50%; width: 18px; height: 18px; margin-top: -9px; border-radius: 999px; background: var(--c-bg); border: 1px solid var(--c-line); }
  .chowk .coupon::before { left: -10px; clip-path: inset(0 0 0 50%); }
  .chowk .coupon::after { right: -10px; clip-path: inset(0 50% 0 0); }
  .chowk .ck-bone { background: var(--c-surface); animation: ck-wave 1.2s ease-in-out infinite; }
}
@keyframes ck-wave { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@media (prefers-reduced-motion: reduce) {
  .chowk *, .chowk *::before, .chowk *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
`;

/* ---------- loader: the wordmark rises while a rider crosses the line ---------- */
function Loader({ onDone }) {
  const [leave, setLeave] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLeave(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-(--c-ink) text-(--c-bg)"
      initial={{ y: 0 }}
      animate={leave ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leave && onDone()}
    >
      <span className="overflow-hidden pb-2">
        <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 0.9, ease: EASE }}>
          <Wordmark className="text-[clamp(3.5rem,12vw,7rem)]!" />
        </motion.span>
      </span>
      <div className="relative mt-8 h-px w-[min(280px,70vw)] bg-(--c-bg)/20">
        <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-(--c-accent)" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.3, ease: [0.45, 0, 0.2, 1] }} />
        <motion.span
          className="absolute -top-[14px] grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-(--c-ink) text-(--c-accent)"
          initial={{ left: "0%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 1.3, ease: [0.45, 0, 0.2, 1] }}
        >
          <Icon name="bike" className="h-5 w-5" />
        </motion.span>
      </div>
      <motion.p className="mt-6 text-[14px] text-(--c-bg)/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
        Finding kitchens near you
      </motion.p>
    </motion.div>
  );
}

function Shell() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const [intro, setIntro] = useState(() => {
    try {
      return !reduce && !sessionStorage.getItem("chowk.intro");
    } catch {
      return !reduce;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const finishIntro = () => {
    try {
      sessionStorage.setItem("chowk.intro", "1");
    } catch {
      /* private mode: the loader simply shows again next time */
    }
    setIntro(false);
  };

  return (
    <div className="chowk flex min-h-dvh flex-col" style={vars}>
      <style>{CSS}</style>
      <a href="#chowk-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-(--c-ink) focus:px-4 focus:py-2 focus:text-(--c-bg)">
        Skip to content
      </a>
      <AnimatePresence>{intro && <Loader onDone={finishIntro} />}</AnimatePresence>
      <Nav />
      <AnimatePresence mode="wait">
        <motion.main
          id="chowk-main"
          key={location.pathname}
          className="flex-1"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* Relative paths: the ApexUI router mounts this demo at /demos/chowk/*. */}
          <Routes location={location}>
            <Route index element={<Home ready={!intro} />} />
            <Route path="restaurant/:id" element={<Restaurant />} />
            <Route path="search" element={<Search />} />
            <Route path="offers" element={<Offers />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<Track />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartBar />
      <TabBar />
      <ReplaceCartModal />
      {/* The phone tab bar owns the bottom edge on small screens; the footer links back there. */}
      <div className="hidden lg:block">
        <BackPill />
      </div>
    </div>
  );
}

export default function Chowk() {
  useFonts(FONTS);
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
