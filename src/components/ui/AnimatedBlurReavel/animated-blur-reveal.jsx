import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// Helper: Render a blur-animated word
function BlurWord({ word, color = "text-blue-400", delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll(".blur-char");
    // Reset all chars
    gsap.set(chars, { y: 32, opacity: 0, filter: "blur(12px)" });
    // Animate in a wavy, blur-from-bottom style
    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay });
    tl.to(chars, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      stagger: {
        each: 0.09,
        from: "start"
      },
      ease: "power3.out",
      duration: 0.7,
    })
      .to(chars, {
        y: -12,
        filter: "blur(8px)",
        opacity: 0.7,
        stagger: {
          each: 0.09,
          from: "start"
        },
        ease: "sine.inOut",
        duration: 0.4,
      }, "+=1.1")
      .to(chars, {
        y: 32,
        filter: "blur(12px)",
        opacity: 0,
        stagger: {
          each: 0.09,
          from: "start"
        },
        ease: "power3.in",
        duration: 0.5,
      });
    return () => tl.kill();
  }, [word, delay]);
  return (
    <span ref={ref} className="inline-block">
      {word.split("").map((char, i) => (
        <span key={i} className={`blur-char inline-block ${color} font-bold`}>
          {char}
        </span>
      ))}
    </span>
  );
}

// Only one line, with animated words in place of 'light weight'
const animatedWords = [
  { text: "light weight", color: "text-blue-400" },
  { text: "super fast", color: "text-green-400" },
  { text: "modern UI", color: "text-purple-400" },
  { text: "responsive", color: "text-cyan-400" },
  { text: "open source", color: "text-pink-400" },
  { text: "bestUIplatform", color: "text-yellow-400" },
];

export default function AnimatedBlurReveal() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((idx) => (idx + 1) % animatedWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-cyan-700/30 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl" />
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 gap-1">
        <div className="text-lg sm:text-xl font-semibold text-white flex gap-2 flex-wrap">
          <span className="opacity-90">ApexUI is</span>
          <BlurWord word={animatedWords[activeIdx].text} color={animatedWords[activeIdx].color} delay={0.2} />
          <span className="opacity-90">aur Best UI platform</span>
        </div>
      </div>
    </div>
  );
}