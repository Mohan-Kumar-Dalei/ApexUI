/* eslint-disable no-unused-vars */
import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { motion } from 'framer-motion';

// GSAP ko ScrollTrigger plugin ke saath register karna zaroori hai
gsap.registerPlugin(ScrollTrigger);

// --- Naya Focus Reveal Text Component ---
const FocusRevealText = ({ text, className }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const chars = new SplitType(containerRef.current, { types: 'chars' }).chars;
    const ctx = gsap.context(() => {
      gsap.set(chars, { opacity: 0.2, filter: 'blur(4px)' });
      gsap.to(chars, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 1.5,
        },
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out',
        stagger: 0.1,
      });
    }, containerRef);
    return () => ctx.revert();
  }, [text]);

  return (
    <div ref={containerRef} id='focus-reveal-text' className={`text-5xl md:text-7xl  text-[var(--color-focus-reveal-text-2)] text-center max-w-7xl whitespace-pre-wrap ${className}`}>
      {text}
    </div>
  );
};
// --- NEW: Animated Background Shapes Component ---
const AnimatedShapes = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 bg-lime-400/5 rounded-full animate-pulse-slow"
        variants={itemVariants}
      />
      <motion.div
        className="absolute top-1/4 -right-24 w-60 h-60 bg-emerald-500/5 rounded-2xl animate-spin-slow"
        variants={itemVariants}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 w-40 h-40 bg-sky-500/5 rounded-full animate-pulse-slow"
        variants={itemVariants}
      />
      <motion.div
        className="absolute -bottom-20 right-1/4 w-72 h-40 bg-teal-500/5 rounded-lg animate-spin-slow-reverse"
        variants={itemVariants}
      />
    </motion.div>
  );
};


// --- Main App Component ---
const FocusRevealChar = () => {
  const text = "ApexUI Special Effects for Modern Web — Smooth, Animated, and Interactive UI Components for Creators";
  <FocusRevealText text={text} />

  return (
    <div className="bg-[var(--color-focus-reveal-bg)] text-[var(--color-focus-reveal-text)]">

      <section className="relative w-full py-48 px-8 flex items-center justify-center">
        <AnimatedShapes />
        <div className="relative z-10 max-w-7xl">
          <FocusRevealText text={text} />
        </div>
      </section>
    </div>
  );
};

export default FocusRevealChar;
