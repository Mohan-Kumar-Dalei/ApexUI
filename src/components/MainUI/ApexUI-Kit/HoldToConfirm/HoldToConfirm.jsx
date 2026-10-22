import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

/*
 * Hold to Confirm: for actions you don't want to trigger by accident. Press
 * and hold (pointer, Enter or Space) and a solid copy of the button wipes
 * in from the left; let go, slide off the button or lose focus and it snaps
 * back. Once the wipe finishes it confirms and resets after `resetAfter`.
 */

const HoldToConfirm = ({ children = "Hold to confirm", className = "", confirmedContent, disabled, duration = 1600, onConfirm, resetAfter = 1800, ...buttonProps }) => {
    const buttonRef = useRef(null);
    const confirmTimerRef = useRef(null);
    const resetTimerRef = useRef(null);
    const activePointerIdRef = useRef(null);
    const inputModeRef = useRef("pointer");
    const isHoldingRef = useRef(false);
    const [inputMode, setInputMode] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | holding | confirmed
    const shouldReduceMotion = useReducedMotion();

    const clearConfirmTimer = useCallback(() => {
        if (confirmTimerRef.current === null) return;
        window.clearTimeout(confirmTimerRef.current);
        confirmTimerRef.current = null;
    }, []);

    const completeHold = useCallback(() => {
        if (!isHoldingRef.current) return;
        isHoldingRef.current = false;
        activePointerIdRef.current = null;
        clearConfirmTimer();
        setStatus("confirmed");
        onConfirm?.(inputModeRef.current);
        if (resetAfter > 0) {
            resetTimerRef.current = window.setTimeout(() => {
                setStatus("idle");
                resetTimerRef.current = null;
            }, resetAfter);
        }
    }, [clearConfirmTimer, onConfirm, resetAfter]);

    const cancelHold = useCallback(() => {
        if (!isHoldingRef.current) return;
        isHoldingRef.current = false;
        activePointerIdRef.current = null;
        clearConfirmTimer();
        setStatus("idle");
    }, [clearConfirmTimer]);

    const startHold = useCallback(
        (input) => {
            if (disabled || status === "confirmed" || isHoldingRef.current) return;
            if (resetTimerRef.current !== null) {
                window.clearTimeout(resetTimerRef.current);
                resetTimerRef.current = null;
            }
            inputModeRef.current = input;
            setInputMode(input);
            isHoldingRef.current = true;
            setStatus("holding");
            confirmTimerRef.current = window.setTimeout(completeHold, duration);
        },
        [completeHold, disabled, duration, status],
    );

    useEffect(
        () => () => {
            clearConfirmTimer();
            if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
        },
        [clearConfirmTimer],
    );

    useEffect(() => {
        if (disabled) cancelHold();
    }, [cancelHold, disabled]);

    const releasePointerCapture = (pointerId) => {
        const button = buttonRef.current;
        if (button?.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
    };

    const handlePointerDown = (event) => {
        if (!event.isPrimary || event.button !== 0 || disabled) return;
        activePointerIdRef.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        startHold("pointer");
    };

    const handlePointerMove = (event) => {
        if (!isHoldingRef.current || activePointerIdRef.current !== event.pointerId) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const boundaryPadding = 8;
        const isOutside = event.clientX < rect.left - boundaryPadding || event.clientX > rect.right + boundaryPadding || event.clientY < rect.top - boundaryPadding || event.clientY > rect.bottom + boundaryPadding;
        if (isOutside) {
            cancelHold();
            releasePointerCapture(event.pointerId);
        }
    };

    const handlePointerEnd = (event) => {
        if (activePointerIdRef.current !== event.pointerId) return;
        cancelHold();
        releasePointerCapture(event.pointerId);
    };

    const handleKeyDown = (event) => {
        if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        startHold("keyboard");
    };

    const handleKeyUp = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        cancelHold();
    };

    const isConfirmed = status === "confirmed";
    const isHolding = status === "holding";
    const overlayStyle = {
        clipPath: isHolding ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
        transitionDuration: shouldReduceMotion || inputMode === "keyboard" ? "0ms" : isHolding ? `${duration}ms` : "180ms",
        transitionProperty: "clip-path",
        transitionTimingFunction: isHolding ? "linear" : "cubic-bezier(0.23, 1, 0.32, 1)",
    };

    return (
        <button
            {...buttonProps}
            aria-busy={isHolding}
            className={`relative isolate inline-flex h-9 min-w-40 cursor-pointer touch-none select-none items-center justify-center overflow-hidden rounded-lg border border-red-500 px-3 text-sm font-medium outline-none transition-[transform,border-color,background-color,color] duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent data-[input=pointer]:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${isConfirmed ? "bg-red-500 text-white" : "bg-red-500/10 text-red-500"} ${className}`}
            data-input={inputMode ?? undefined}
            disabled={disabled}
            onBlur={cancelHold}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onLostPointerCapture={cancelHold}
            onPointerCancel={handlePointerEnd}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            ref={buttonRef}
            type="button"
        >
            {isConfirmed ? (
                <span className="relative flex items-center justify-center gap-1.5">
                    {confirmedContent ?? (
                        <>
                            <Check aria-hidden="true" className="h-[15px] w-[15px]" strokeWidth={3} />
                            Confirmed
                        </>
                    )}
                </span>
            ) : (
                <>
                    <span className="relative flex items-center justify-center gap-1.5">{children}</span>
                    <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center gap-1.5 bg-red-500 px-3 text-white" style={overlayStyle}>
                        {children}
                    </span>
                </>
            )}
        </button>
    );
};

export default HoldToConfirm;
