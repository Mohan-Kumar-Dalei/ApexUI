/* eslint-disable no-unused-vars */
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const messages = [
  "🚀 Apex UI — Build modern UIs in seconds.",
  "📦 100% reusable components & CLI setup.",
  "🎯 Fast, accessible, production-ready.",
  "💡 Drop-in React components with Tailwind CSS.",
  "🦄 Stunning glassmorphism & neon effects out of the box.",
  "⚡️ Super smooth framer-motion & GSAP animations.",
  "🔒 Secure, scalable, and easy to customize.",
  "🌈 Beautiful gradients, shadows, and modern layouts.",
  "🛠️ Designed for devs, loved by designers.",
  "📚 Full docs & live playground included!",
  "🌟 More UI components coming soon...",
  "✨ Built with love and care."
];

export default function ModernInsetMessageBar() {
  const [visible, setVisible] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  React.useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-[999] h-10 sm:h-10 flex items-center justify-center px-4 text-white font-medium text-sm sm:text-base tracking-wide transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        } bg-gradient-to-br from-purple-800 to-slate-950 shadow-[inset_0_-2px_4px_rgba(255,255,255,0.05),_0_2px_6px_rgba(0,0,0,0.4)]`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="inline-block text-center px-4 py-1 rounded-md"
        >
          {messages[current]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
