import React, { useRef } from "react";
import gsap from "gsap";

const HoverText = ({
    text = "ApexUI",
    fontSize = "2.5rem",
    className = "",
    effect, // if not passed, use 'defaultReveal'
    effectColor = "#C27AFF"
}) => {
    const charsRef = useRef([]);
    const containerRef = useRef(null);

    // Default animated reveal
    function handleDefaultEnter(i) {
        if (effect && effect !== "defaultReveal") return;
        const el = charsRef.current[i];
        if (!el) return;
        gsap.to(el, {
            scale: 1.4,
            rotate: gsap.utils.random(-10, 10),
            color: effectColor,
            filter: `drop-shadow(0 4px 32px ${effectColor})`,
            duration: 0.32,
            ease: "elastic.out(1,0.5)",
        });
    }
    function handleDefaultLeave(i) {
        if (effect && effect !== "defaultReveal") return;
        const el = charsRef.current[i];
        if (!el) return;
        gsap.to(el, {
            scale: 1,
            rotate: 0,
            color: "#fff",
            filter: `drop-shadow(0 0px 0px ${effectColor})`,
            duration: 0.32,
            ease: "expo.inOut",
        });
    }

    // Party effect
    function handlePartyEnter() {
        if (effect !== "party") return;
        charsRef.current.forEach((el, i) => {
            if (!el) return;
            gsap.to(el, {
                scale: 1.25,
                rotate: (i % 2 === 0 ? 1 : -1) * (18 + i * 4),
                color: effectColor,
                filter: `drop-shadow(0 4px 32px ${effectColor})`,
                duration: 0.38,
                ease: "elastic.out(1,0.5)",
            });
        });
    }
    function handlePartyLeave() {
        if (effect !== "party") return;
        charsRef.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                scale: 1,
                rotate: 0,
                color: "#fff",
                filter: `drop-shadow(0 0px 0px ${effectColor})`,
                duration: 0.38,
                ease: "expo.inOut",
            });
        });
    }

    // Reset all letters on mount or color change
    React.useEffect(() => {
        charsRef.current.forEach((el) => {
            if (el) {
                gsap.set(el, {
                    scale: 1,
                    rotate: 0,
                    x: 0,
                    y: 0,
                    filter: `drop-shadow(0 0px 0px ${effectColor})`,
                    color: "#fff",
                });
            }
        });
    }, [text, effectColor]);

    // Magnetic effect
    const handleMouseMove = (e) => {
        if (effect !== "magnetic") return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        let minDist = Infinity;
        let minIdx = -1;
        charsRef.current.forEach((el, i) => {
            if (!el) return;
            const elRect = el.getBoundingClientRect();
            const elCenterX = elRect.left - rect.left + elRect.width / 2;
            const elCenterY = elRect.top - rect.top + elRect.height / 2;
            const dx = (mouseX - elCenterX) / rect.width;
            const dy = (mouseY - elCenterY) / rect.height;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                minIdx = i;
            }
        });
        // Animate all letters
        charsRef.current.forEach((el, i) => {
            if (!el) return;
            const elRect = el.getBoundingClientRect();
            const elCenterX = elRect.left - rect.left + elRect.width / 2;
            const elCenterY = elRect.top - rect.top + elRect.height / 2;
            const dx = (mouseX - elCenterX) / rect.width;
            const dy = (mouseY - elCenterY) / rect.height;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 0.35;
            const mag = Math.max(0, 1 - dist / maxDist);
            const isFocus = i === minIdx;
            gsap.to(el, {
                x: dx * 18 * mag,
                y: dy * 18 * mag,
                scale: isFocus ? 1.22 : 1 + 0.12 * mag,
                rotate: dx * 10 * mag,
                filter: isFocus
                    ? `drop-shadow(0 4px 32px ${effectColor})`
                    : `drop-shadow(0 2px 16px ${effectColor}44)`,
                color: isFocus ? effectColor : "#fff",
                zIndex: isFocus ? 10 : 2,
                duration: 0.35,
                ease: "expo.out",
            });
        });
    };

    // Rubber effect
    function handleRubberEnter(i) {
        if (effect !== "rubber") return;
        const el = charsRef.current[i];
        if (!el) return;
        gsap.to(el, {
            scaleX: 1.5,
            scaleY: 0.7,
            color: effectColor,
            filter: `drop-shadow(0 4px 32px ${effectColor})`,
            duration: 0.22,
            ease: "expo.out",
            onComplete: () => {
                gsap.to(el, {
                    scaleX: 0.85,
                    scaleY: 1.18,
                    duration: 0.18,
                    ease: "expo.inOut",
                    onComplete: () => {
                        gsap.to(el, {
                            scaleX: 1,
                            scaleY: 1,
                            color: "#fff",
                            filter: `drop-shadow(0 0px 0px ${effectColor})`,
                            duration: 0.18,
                            ease: "expo.inOut",
                        });
                    }
                });
            }
        });
    }

    // Jump effect
    function handleJumpEnter(i) {
        if (effect !== "jump") return;
        for (let j = -1; j <= 1; j++) {
            const idx = i + j;
            const el = charsRef.current[idx];
            if (!el) continue;
            if (j === 0) {
                gsap.to(el, {
                    y: -28,
                    color: effectColor,
                    filter: `drop-shadow(0 4px 32px ${effectColor})`,
                    duration: 0.32,
                    ease: "expo.out",
                });
            } else {
                gsap.to(el, {
                    x: j * 8,
                    rotate: j * 8,
                    duration: 0.22,
                    ease: "expo.out",
                });
            }
        }
    }
    function handleJumpLeave(i) {
        if (effect !== "jump") return;
        for (let j = -1; j <= 1; j++) {
            const idx = i + j;
            const el = charsRef.current[idx];
            if (!el) continue;
            gsap.to(el, {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                color: "#fff",
                filter: `drop-shadow(0 0px 0px ${effectColor})`,
                duration: 0.32,
                ease: "expo.inOut",
            });
        }
    }

    // Rotate effect
    function handleRotateEnter(i) {
        if (effect !== "rotate") return;
        for (let j = -1; j <= 1; j++) {
            const idx = i + j;
            const el = charsRef.current[idx];
            if (!el) continue;
            if (j === 0) {
                gsap.to(el, {
                    rotate: 24,
                    scale: 1.18,
                    color: effectColor,
                    filter: `drop-shadow(0 4px 32px ${effectColor})`,
                    duration: 0.32,
                    ease: "expo.out",
                });
            } else {
                gsap.to(el, {
                    rotate: j * 12,
                    duration: 0.22,
                    ease: "expo.out",
                });
            }
        }
    }
    function handleRotateLeave(i) {
        if (effect !== "rotate") return;
        for (let j = -1; j <= 1; j++) {
            const idx = i + j;
            const el = charsRef.current[idx];
            if (!el) continue;
            gsap.to(el, {
                scale: 1,
                rotate: 0,
                color: "#fff",
                filter: `drop-shadow(0 0px 0px ${effectColor})`,
                duration: 0.32,
                ease: "expo.inOut",
            });
        }
    }

    // Wave effect
    function handleCharEnter(i) {
        if (effect !== "wave") return;
        for (let j = -2; j <= 2; j++) {
            const idx = i + j;
            const el = charsRef.current[idx];
            if (!el) continue;
            gsap.to(el, {
                y: -18 + Math.abs(j) * 8,
                scale: 1.12 - Math.abs(j) * 0.08,
                color: effectColor,
                filter: `drop-shadow(0 4px 32px ${effectColor})`,
                duration: 0.38 + Math.abs(j) * 0.08,
                ease: "elastic.out(1,0.5)",
            });
        }
    }
    function handleCharLeave(i) {
        if (effect !== "wave") return;
        for (let j = -2; j <= 2; j++) {
            const idx = i + j;
            const el = charsRef.current[idx];
            if (!el) continue;
            gsap.to(el, {
                y: 0,
                scale: 1,
                color: "#fff",
                filter: `drop-shadow(0 0px 0px ${effectColor})`,
                duration: 0.38 + Math.abs(j) * 0.08,
                ease: "expo.inOut",
            });
        }
    }

    // Reset on mouse leave
    const handleMouseLeave = () => {
        if (effect === "magnetic") {
            charsRef.current.forEach((el) => {
                if (el) {
                    gsap.to(el, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                        color: "#fff",
                        filter: `drop-shadow(0 0px 0px ${effectColor})`,
                        duration: 0.6,
                        ease: "expo.inOut",
                    });
                }
            });
        } else if (effect === "flip") {
            charsRef.current.forEach((el) => {
                if (el) {
                    gsap.to(el, {
                        rotateY: 0,
                        color: "#fff",
                        filter: `drop-shadow(0 0px 0px ${effectColor})`,
                        duration: 0.6,
                        ease: "expo.inOut",
                    });
                }
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex items-center select-none cursor-pointer ${className}`}
            style={{ fontSize, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", background: "none", userSelect: "none" }}
            onMouseMove={effect === "magnetic" ? handleMouseMove : undefined}
            onMouseLeave={effect === "party" ? handlePartyLeave : handleMouseLeave}
            onMouseEnter={effect === "party" ? handlePartyEnter : undefined}
        >
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    ref={el => charsRef.current[i] = el}
                    onMouseEnter={
                        !effect || effect === "defaultReveal" ? () => handleDefaultEnter(i)
                            : effect === "wave" ? () => handleCharEnter(i)
                                : effect === "rubber" ? () => handleRubberEnter(i)
                                    : effect === "jump" ? () => handleJumpEnter(i)
                                        : effect === "rotate" ? () => handleRotateEnter(i)
                                            : undefined
                    }
                    onMouseLeave={
                        !effect || effect === "defaultReveal" ? () => handleDefaultLeave(i)
                            : effect === "wave" ? () => handleCharLeave(i)
                                : effect === "rubber" ? () => handleRubberEnter(i)
                                    : effect === "jump" ? () => handleJumpLeave(i)
                                        : effect === "rotate" ? () => handleRotateLeave(i)
                                            : undefined
                    }
                    style={{
                        display: "inline-block",
                        marginRight: char === " " ? "0.18em" : 0,
                        padding: "0 0.04em",
                        willChange: "transform, color, filter, opacity",
                        borderRadius: "0.18em",
                        position: "relative",
                        zIndex: 2,
                        color: "#fff",
                        background: "none",
                        transition: "filter 0.3s, color 0.3s, background 0.3s, opacity 0.3s",
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </div>
    );
};

export default HoverText;
