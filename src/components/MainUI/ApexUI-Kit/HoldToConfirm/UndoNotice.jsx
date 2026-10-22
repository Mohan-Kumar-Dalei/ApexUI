import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";

/*
 * Undo Notice: pairs with HoldToConfirm. Shows what just happened with an
 * Undo button whose solid fill drains away over `duration`; when it runs
 * out, onExpire fires. onUndo tells you if it came from a key or a pointer.
 */

const UndoNotice = ({ className = "", duration = 5000, message = "Project deleted", onExpire, onUndo }) => {
    const [isCounting, setIsCounting] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => setIsCounting(true));
        const timer = window.setTimeout(() => onExpire?.(), duration);
        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, [duration, onExpire]);

    return (
        <div aria-live="polite" role="status" className={`flex min-h-9 w-full max-w-xs items-center justify-between gap-3 rounded-xl bg-neutral-100 p-1 pl-3 dark:bg-neutral-800 ${className}`}>
            <div className="flex min-w-0 items-center gap-2">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 fill-green-500 text-white dark:text-neutral-800" />
                <p className="truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">{message}</p>
            </div>

            <button
                type="button"
                onClick={(event) => onUndo?.(event.detail === 0 ? "keyboard" : "pointer")}
                className="relative isolate flex h-7 min-w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-600 outline-none transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-neutral-400 active:scale-[0.97] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
            >
                <span className="flex items-center gap-1.5">
                    <RotateCcw aria-hidden="true" className="h-[13px] w-[13px]" strokeWidth={2.5} />
                    Undo
                </span>
                <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center gap-1.5 bg-neutral-900 px-2.5 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    style={{
                        clipPath: isCounting ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
                        transitionDuration: shouldReduceMotion ? "0ms" : `${duration}ms`,
                        transitionProperty: "clip-path",
                        transitionTimingFunction: "linear",
                    }}
                >
                    <RotateCcw aria-hidden="true" className="h-[13px] w-[13px]" strokeWidth={2.5} />
                    Undo
                </span>
            </button>
        </div>
    );
};

export default UndoNotice;
