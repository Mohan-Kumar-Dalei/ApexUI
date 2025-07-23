import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export default function LightningCard({
  text = "Apex UI is Lightning",
  LastText = "Speed",
  LastTextColor = "purple",
  SubText = "Experience the power of Apex UI with our stunning components and effects. Perfect for modern web applications, our library is designed to be fast, flexible, and easy to use.",

  children,
  width = "w-80",
  height = "h-52",
  starColor = "#ffffff",
  starCount = 150,
  glow = true,
  baseSpeed = 0.5,
  warpSpeed = 8.5,
  circlePosition = "bottom"
}) {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const stars = useRef([]);
  const speedRef = useRef({ value: 0.5 }); // << key part

  // 🌠 Starfield logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrame;
    let w, h;

    const init = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;

      stars.current = Array.from({ length: starCount }, () => {
        const z = Math.random() * w;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          baseZ: z,
          brightness: Math.random() * 0.5 + 0.5,
        };
      });
    };

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = starColor;

      stars.current.forEach((star) => {
        star.z -= speedRef.current.value;

        if (star.z <= 1) {
          star.z = star.baseZ;
        }

        const sx = (star.x - w / 2) * (w / star.z) + w / 2;
        const sy = (star.y - h / 2) * (h / star.z) + h / 2;
        const size = (1 - star.z / w) * 2;

        ctx.beginPath();
        ctx.globalAlpha = star.brightness;

        ctx.beginPath();
        ctx.globalAlpha = star.brightness;

        if (speedRef.current.value > baseSpeed + 0.3) {
          // 🎯 Draw beam from center (angle-based warp tunnel)
          const tailLength = speedRef.current.value * 3;

          const dx = sx - w / 2;
          const dy = sy - h / 2;
          const mag = Math.sqrt(dx * dx + dy * dy) || 1;

          ctx.moveTo(sx, sy);
          ctx.lineTo(
            sx + (dx / mag) * tailLength,
            sy + (dy / mag) * tailLength
          );

          ctx.strokeStyle = starColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // ✨ Draw twinkling dot
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;


      });

      animationFrame = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", init);
    };
  }, [starColor, starCount]);

  // ✅ Smooth Speed Transition
  useEffect(() => {
    gsap.to(speedRef.current, {
      value: hovered ? warpSpeed : baseSpeed,
      duration: 1.5,
      ease: "power4.inOut",
    });
  }, [hovered]);

  // 🫨 Text hover effect (shake + scale down)
  useEffect(() => {
    const el = contentRef.current;

    if (hovered) {
      gsap.to(el, {
        scale: 0.95,
        duration: 0.5,
        ease: "power1.out",
      });
      gsap.to(el, {
        x: "+=1",
        y: "-=1",
        duration: 0.05,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    } else {
      gsap.killTweensOf(el);
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [hovered]);

  return (
    <div
      className={`relative overflow-hidden rounded-md ${width} ${height} group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
      />

      {/* Optional Beam Glow */}
      {glow && (
        <div
          className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          style={{

            mixBlendMode: "screen",
            opacity: 0.5,
            background: `radial-gradient(circle at ${circlePosition}, ${starColor} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Text Content (from prop, fallback to children) */}
      <div ref={contentRef} className="relative z-20 p-4 text-white h-full">

        <div className='w-full h-full flex flex-col items-center justify-center relative gap-2'>

          {/* 🚀 Content */}
          <h2 className="text-2xl font-normal z-20">
            {text ? text : children} <span className={`font-bold text-${LastTextColor}-400`}>{LastText}</span>
          </h2>
          <p className="text-sm text-gray-300 text-center max-w-md z-20">
            {SubText}
          </p>
        </div>


      </div>
    </div>
  );
}
