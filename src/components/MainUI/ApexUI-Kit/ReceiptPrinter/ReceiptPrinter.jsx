import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleCheck, LoaderCircle, Printer, RotateCcw } from "lucide-react";

/*
 * Receipt Printer: a little thermal printer that processes a payment, feeds a
 * receipt out of its slot and settles on "Payment complete".
 *
 * Runs on its own (autoPlay) or follows a controlled `stage`:
 *   "processing" → "printing" → "complete"
 */

const defaultItems = [
    { name: "Iced Latte", qty: 2, price: 4.5 },
    { name: "Blueberry Muffin", qty: 1, price: 3.25 },
    { name: "Avocado Toast", qty: 1, price: 8.9 },
    { name: "Sparkling Water", qty: 1, price: 2 },
];

const STATUS = {
    processing: { label: "Processing payment", Icon: LoaderCircle },
    printing: { label: "Printing receipt", Icon: Printer },
    complete: { label: "Payment complete", Icon: CircleCheck },
};

const ease = [0.22, 1, 0.36, 1];

/*
 * Keyframes for a "stepped" feed: the paper advances in short bursts with a
 * pause after each one, like a thermal printer printing line by line.
 */
function steppedFeed(steps = 9, moveShare = 0.62) {
    const y = ["-100%"];
    const times = [0];
    for (let i = 1; i <= steps; i++) {
        // Ease the step sizes so the paper starts slow and speeds up a little.
        const progress = 1 - Math.pow(1 - i / steps, 1.35);
        const at = -100 + progress * 100;
        const start = (i - 1) / steps;
        const end = i / steps;
        y.push(`${at.toFixed(2)}%`, `${at.toFixed(2)}%`);
        times.push(start + (end - start) * moveShare, end);
    }
    return { y, times };
}

// Bar widths derived from the order id, so the same order always gets the same barcode.
function barcodeBars(code, count = 38) {
    const seed = [...String(code)].reduce((sum, ch, i) => sum + ch.charCodeAt(0) * (i + 7), 0);
    return Array.from({ length: count }, (_, i) => 1 + ((seed * (i + 3) * 2654435761) >>> 0) % 3);
}

const money = (value, currency) => `${currency}${value.toFixed(2)}`;

// Zig-zag tear along the bottom edge of the paper.
const tearMask = {
    WebkitMask:
        "linear-gradient(#000 0 0) top / 100% calc(100% - 7px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 14px 7px repeat-x",
    mask: "linear-gradient(#000 0 0) top / 100% calc(100% - 7px) no-repeat, conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 14px 7px repeat-x",
};

function Receipt({ store, address, items, currency, taxRate, orderId, date }) {
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    const tax = subtotal * taxRate;
    const bars = useMemo(() => barcodeBars(orderId), [orderId]);

    return (
        <article
            className="relative bg-[#fbfaf5] px-5 pb-8 pt-5 font-mono text-[0.72rem] leading-relaxed text-zinc-800 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.6)]"
            style={tearMask}
        >
            {/* faint thermal-paper grain */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 3px)" }}
            />
            <div className="relative">
                <p className="text-center text-[0.85rem] font-bold uppercase tracking-[0.18em]">{store}</p>
                {address && <p className="mt-0.5 text-center text-[0.65rem] text-zinc-500">{address}</p>}
                <p className="mt-0.5 text-center text-[0.65rem] text-zinc-500">{date}</p>

                <div className="my-3 border-t border-dashed border-zinc-400" />

                <ul className="space-y-1">
                    {items.map((item, i) => (
                        <li key={i} className="flex justify-between gap-3">
                            <span className="min-w-0 truncate">
                                {item.qty} × {item.name}
                            </span>
                            <span className="shrink-0 tabular-nums">{money(item.qty * item.price, currency)}</span>
                        </li>
                    ))}
                </ul>

                <div className="my-3 border-t border-dashed border-zinc-400" />

                <div className="space-y-0.5 text-zinc-600">
                    <p className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{money(subtotal, currency)}</span></p>
                    <p className="flex justify-between"><span>Tax {Math.round(taxRate * 100)}%</span><span className="tabular-nums">{money(tax, currency)}</span></p>
                </div>
                <p className="mt-2 flex justify-between text-[0.85rem] font-bold">
                    <span>TOTAL</span>
                    <span className="tabular-nums">{money(subtotal + tax, currency)}</span>
                </p>

                <div className="my-3 border-t border-dashed border-zinc-400" />

                <div aria-hidden="true" className="flex h-9 items-stretch justify-center gap-[1.5px]">
                    {bars.map((w, i) => (
                        <span key={i} className="bg-zinc-800" style={{ width: w }} />
                    ))}
                </div>
                <p className="mt-1 text-center text-[0.62rem] tracking-[0.3em] text-zinc-500">{orderId}</p>
                <p className="mt-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.25em]">Thank you</p>
            </div>
        </article>
    );
}

const ReceiptPrinter = ({
    store = "ApexUI Café",
    address = "221B Baker Street",
    items = defaultItems,
    currency = "$",
    taxRate = 0.08,
    orderId = "AX-20491",
    date,
    stage,
    autoPlay = true,
    feed = "stepped",
    processingTime = 1600,
    printTime = 2200,
    accentColor = "#a3e635",
    onComplete,
    className = "",
}) => {
    const controlled = stage !== undefined;
    const [ownStage, setOwnStage] = useState(autoPlay ? "processing" : "complete");
    const [run, setRun] = useState(0);
    const current = controlled ? stage : ownStage;
    const reduceMotion = useReducedMotion();
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    // Self-running sequence (skipped when the parent controls the stage).
    useEffect(() => {
        if (controlled || (!autoPlay && run === 0)) return undefined;
        setOwnStage("processing");
        const toPrint = setTimeout(() => setOwnStage("printing"), processingTime);
        const toDone = setTimeout(() => {
            setOwnStage("complete");
            onCompleteRef.current?.();
        }, processingTime + printTime);
        return () => {
            clearTimeout(toPrint);
            clearTimeout(toDone);
        };
    }, [controlled, autoPlay, run, processingTime, printTime]);

    const printedAt = useMemo(
        () =>
            date ??
            new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
        // A fresh timestamp for every print run.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [date, run]
    );

    const stepped = useMemo(() => steppedFeed(), []);
    const moving = !reduceMotion;
    const paperY =
        current === "processing"
            ? "-100%"
            : current === "printing" && moving
                ? feed === "stepped"
                    ? stepped.y
                    : "0%"
                : "0%";
    const paperTransition =
        current === "printing" && moving
            ? feed === "stepped"
                ? { duration: printTime / 1000, ease: "linear", times: stepped.times }
                : { duration: printTime / 1000, ease: [0.65, 0, 0.35, 1] }
            : { duration: 0 };

    const { label, Icon } = STATUS[current] ?? STATUS.processing;
    const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

    return (
        <section aria-label="Receipt printer" className={`relative isolate flex w-[20rem] max-w-full flex-col items-center ${className}`}>
            {/* Machine */}
            <div
                className="relative z-20 w-full rounded-[1.75rem] border border-white/10 bg-[#1b1b20] p-3 pb-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-2px_0_rgba(0,0,0,0.5)]"
            >
                {/* matte plastic texture */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.12]"
                    style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 0.5px, transparent 0.6px)", backgroundSize: "4px 4px" }}
                />

                {/* Top row: brand, LED and reprint */}
                <div className="relative flex h-10 items-center justify-between px-2">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/40">Apex · Print</span>
                    <div className="flex items-center gap-2">
                        <span
                            aria-hidden="true"
                            className={`h-2 w-2 rounded-full ${current === "printing" && moving ? "animate-pulse" : ""}`}
                            style={{
                                backgroundColor: current === "complete" ? accentColor : current === "printing" ? accentColor : "#f59e0b",
                                boxShadow: `0 0 10px ${current === "processing" ? "#f59e0b" : accentColor}`,
                            }}
                        />
                        {!controlled && (
                            <button
                                type="button"
                                onClick={() => setRun((r) => r + 1)}
                                disabled={current !== "complete"}
                                aria-label="Print again"
                                title="Print again"
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:text-white disabled:pointer-events-none disabled:opacity-30"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Screen */}
                <div className="relative overflow-hidden rounded-[1.1rem] border border-black/60 bg-[#0b0e0c] px-4 py-3.5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center gap-2.5" role="status" aria-live="polite">
                        <span className="relative grid h-5 w-5 shrink-0 place-items-center" style={{ color: current === "processing" ? "#f59e0b" : accentColor }}>
                            <AnimatePresence initial={false} mode="popLayout">
                                <motion.span
                                    key={current}
                                    initial={moving ? { opacity: 0, scale: 0.7 } : false}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={moving ? { opacity: 0, scale: 0.7 } : { opacity: 0 }}
                                    transition={{ duration: 0.2, ease }}
                                    className="grid place-items-center"
                                >
                                    <Icon className={`h-[18px] w-[18px] ${current === "processing" && moving ? "animate-spin" : ""}`} strokeWidth={2.2} />
                                </motion.span>
                            </AnimatePresence>
                        </span>
                        <div className="relative h-4 min-w-0 flex-1 overflow-hidden">
                            <AnimatePresence initial={false} mode="popLayout">
                                <motion.p
                                    key={current}
                                    initial={moving ? { opacity: 0, y: 8 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={moving ? { opacity: 0, y: -8 } : { opacity: 0 }}
                                    transition={{ duration: 0.22, ease }}
                                    className="truncate text-xs font-medium leading-4 text-zinc-200"
                                >
                                    {label}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between font-mono text-[0.62rem] text-zinc-500">
                        <span>#{orderId}</span>
                        <span>{itemCount} items</span>
                    </div>
                    {/* Progress while printing */}
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                            key={`${run}-${current}`}
                            className="h-full rounded-full"
                            style={{ backgroundColor: current === "processing" ? "#f59e0b" : accentColor }}
                            initial={{ width: current === "printing" ? "0%" : current === "complete" ? "100%" : "35%" }}
                            animate={{ width: current === "processing" ? ["15%", "60%", "15%"] : "100%" }}
                            transition={
                                current === "processing"
                                    ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                                    : { duration: current === "printing" && moving ? printTime / 1000 : 0, ease: "linear" }
                            }
                        />
                    </div>
                </div>

                {/* Paper slot */}
                <div aria-hidden="true" className="absolute inset-x-7 bottom-3 h-2 rounded-full bg-black shadow-[inset_0_2px_3px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.06)]" />
            </div>

            {/* Paper coming out of the slot */}
            <div className="relative z-10 -mt-4 w-[86%] overflow-hidden px-1 pb-4 pt-0">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-1 top-0 z-10 h-3 bg-gradient-to-b from-black/45 to-transparent" />
                <motion.div
                    key={run}
                    initial={{ y: "-100%" }}
                    animate={{ y: paperY }}
                    transition={paperTransition}
                    aria-hidden={current !== "complete"}
                >
                    <Receipt store={store} address={address} items={items} currency={currency} taxRate={taxRate} orderId={orderId} date={printedAt} />
                </motion.div>
            </div>
        </section>
    );
};

export default ReceiptPrinter;
