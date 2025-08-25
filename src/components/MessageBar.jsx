import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import SplitType from 'split-type';
import { MonitorX } from 'lucide-react';

// --- Naya MessageBar Component ---
const messages = [
  "🚀 Apex UI — Build modern UIs in seconds.",
  "📦 100% reusable components & CLI setup.",
  "🎯 Fast, accessible, production-ready.",
  "💡 Drop-in React components with Tailwind CSS.",
  "🦄 Stunning effects out of the box.",
  "⚡️ Super smooth GSAP animations.",
  "🔒 Secure, scalable, and easy to customize.",
  "🛠️ Designed for devs, loved by designers.",
  "📚 Full docs & live playground included!",
  "🌟 More UI components coming soon..."
];

const MessageBar = () => {
  const [current, setCurrent] = useState(0);
  const textRef = useRef(null);
  const barRef = useRef(null);

  // Initial fade-in animation for the bar
  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(barRef.current,
      { y: '-100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  // Scanline and text reveal animation loop
  useLayoutEffect(() => {
    if (!barRef.current || !textRef.current) return;

    // Har naye message ke liye text ko update karna
    textRef.current.textContent = messages[current];

    const text = new SplitType(textRef.current, { types: 'chars' });
    const chars = text.chars;
    const scanline = barRef.current.querySelector('.scanline');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        // Jab timeline complete ho, agle message ke liye state update karein
        onComplete: () => {
          // Thoda delay dena taaki fade-out poora dikhe
          gsap.delayedCall(0.5, () => {
            setCurrent((prev) => (prev + 1) % messages.length);
          });
        }
      });

      tl.fromTo(scanline,
        { x: '-100%' },
        { x: '100%', duration: 2, ease: 'power2.inOut' }
      )
        // Text ko reveal karna
        .fromTo(chars, {
          opacity: 0.3,
          color: '#4b5563'
        }, {
          opacity: 1,
          color: 'var(--color-text)',
          duration: 0.8,
          stagger: {
            each: 0.04,
            from: 'start'
          },
          ease: 'none'
        }, 0.2)
        .to(chars, {
          opacity: 0.3,
          color: '#4b5563',
          duration: 1,
          delay: 0.8,
          stagger: {
            each: 0.02,
            from: 'end'
          }
        });

    }, barRef);

    return () => {
      text.revert();
      ctx.revert();
    };
  }, [current]);
  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 w-full z-[999] h-10 flex items-center justify-center px-4 text-[var(--color-text)] font-medium text-sm sm:text-base tracking-wide bg-[var(--color-bg)] backdrop-blur-md border-b border-[var(--color-border)] overflow-hidden"
    >
      <div className={`scanline absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-[var(--color-scan)]/30 to-transparent`} />
      <div className="flex items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
        </span>
        <p ref={textRef} className="font-mono text-gray-300"></p>
      </div>
    </div>
  );
};

export default MessageBar;
