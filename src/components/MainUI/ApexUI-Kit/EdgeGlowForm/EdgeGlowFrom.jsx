import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

const fields = [
    { name: 'firstName', label: 'First Name', type: 'text', half: true },
    { name: 'lastName', label: 'Last Name', type: 'text', half: true },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'mobile', label: 'Mobile Number', type: 'tel' },
];

// '#a78bfa88' + 'cc' -> '#a78bfacc'; works for #rrggbb and #rrggbbaa colours.
const withAlpha = (hex, alpha) => `${hex.slice(0, 7)}${alpha}`;

const EdgeGlowForm = ({
    GlowColor = 'violet',
    borderGlowColor = '#a78bfa88',
    borderGlowShadow = '#a78bfa33',
}) => {
    const [values, setValues] = useState({ firstName: '', lastName: '', email: '', mobile: '' });
    const [focused, setFocused] = useState('');
    const [checked, setChecked] = useState(false);
    const [btnState, setBtnState] = useState('default');
    const [errors, setErrors] = useState({});
    const [checkboxError, setCheckboxError] = useState(false);
    const labelRefs = useRef({});
    const borderRefs = useRef({});
    const ballsRef = [useRef(), useRef(), useRef()];
    const checkTick = useRef();

    // Edge glow that follows the pointer (mouse, pen or touch)
    const [radialPos, setRadialPos] = useState({ x: 50, y: 50 });
    const [glowing, setGlowing] = useState(false);
    const bgRef = useRef();

    const edgeColor = withAlpha(borderGlowColor, '');

    const handlePointerMove = e => {
        if (!bgRef.current) return;
        const rect = bgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setRadialPos({ x, y });
        setGlowing(true);
    };
    const handlePointerLeave = () => {
        setRadialPos({ x: 50, y: 50 });
        setGlowing(false);
    };

    const floatLabel = (name, up, color = null) => {
        const label = labelRefs.current[name];
        if (label) {
            gsap.to(label, {
                top: up ? '6px' : '50%',
                yPercent: up ? 0 : -50,
                scale: up ? 0.78 : 1,
                color: color ?? (up ? edgeColor : '#a1a1aa'),
                fontWeight: up ? 500 : 400,
                duration: 0.2,
                ease: 'power2.out',
            });
        }
    };

    const showBorder = (name, show, color = borderGlowColor) => {
        (borderRefs.current[name] || []).forEach(border => {
            if (border) {
                gsap.to(border, {
                    opacity: show ? 1 : 0,
                    scaleX: show ? 1 : 0.6,
                    background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                    boxShadow: `0 0 10px 1px ${color === borderGlowColor ? borderGlowShadow : withAlpha(color, '44')}`,
                    duration: 0.25,
                    ease: show ? 'power2.out' : 'power2.in',
                });
            }
        });
    };

    const handleFocus = name => {
        setFocused(name);
        floatLabel(name, true);
        showBorder(name, true);
    };

    const handleBlur = name => {
        setFocused('');
        if (!values[name]) floatLabel(name, false);
        showBorder(name, false);
    };

    const handleChange = (e, name) => {
        const v = e.target.value;
        setValues(vals => ({ ...vals, [name]: v }));
        if (errors[name] && v) setErrors(errs => ({ ...errs, [name]: false }));
        if (v) floatLabel(name, true);
        else if (focused !== name) floatLabel(name, false);
    };

    useEffect(() => {
        fields.forEach(f => {
            (borderRefs.current[f.name] || []).forEach(border => border && gsap.set(border, { opacity: 0, scaleX: 0.6 }));
            if (labelRefs.current[f.name]) gsap.set(labelRefs.current[f.name], {
                top: '50%',
                yPercent: -50,
                scale: 1,
                color: '#a1a1aa',
                transformOrigin: 'left center',
            });
        });
    }, []);

    // Re-colour open borders and labels when the edge colour prop changes.
    useEffect(() => {
        fields.forEach(f => {
            const up = focused === f.name || values[f.name];
            if (up && !errors[f.name]) floatLabel(f.name, true);
            if (focused === f.name) showBorder(f.name, true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [borderGlowColor, borderGlowShadow]);

    const handleCheckbox = () => {
        setChecked(v => {
            const next = !v;
            if (checkTick.current) {
                gsap.to(checkTick.current, {
                    scale: next ? 1 : 0,
                    opacity: next ? 1 : 0,
                    duration: 0.3,
                    ease: 'expo.out',
                });
            }
            return next;
        });
    };

    useEffect(() => {
        if (checkTick.current) gsap.set(checkTick.current, { scale: checked ? 1 : 0, opacity: checked ? 1 : 0 });
    }, [checked]);

    const handleBtnClick = e => {
        e.preventDefault();
        const newErrors = {};
        fields.forEach(f => {
            if (!values[f.name]) newErrors[f.name] = true;
        });
        setErrors(newErrors);
        Object.keys(newErrors).forEach(name => {
            floatLabel(name, true, '#f87171');
            showBorder(name, true, '#f87171cc');
        });
        if (!checked) {
            setCheckboxError(true);
            setTimeout(() => setCheckboxError(false), 2000);
        }
        if (Object.keys(newErrors).length > 0 || !checked) return;
        if (btnState !== 'default') return;

        setBtnState('loading');
        ballsRef.forEach((ref, i) => {
            gsap.fromTo(ref.current, { y: 0 }, {
                y: -10,
                repeat: -1,
                yoyo: true,
                delay: i * 0.12,
                duration: 0.38,
                ease: 'power1.inOut',
            });
        });
        setTimeout(() => {
            setBtnState('success');
            ballsRef.forEach(ref => {
                gsap.killTweensOf(ref.current);
                gsap.set(ref.current, { y: 0 });
            });
            setTimeout(() => {
                setBtnState('default');
            }, 1200);
        }, 1600);
    };

    const glow = `radial-gradient(circle at ${radialPos.x}% ${radialPos.y}%, ${GlowColor} 0%, transparent 55%)`;

    return (
        <div className="w-full">
            <div
                className="relative w-full max-w-sm mx-auto rounded-[1.4rem] p-[2px] text-white touch-pan-y"
                ref={bgRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
            >
                {/* Soft halo outside the card */}
                <div
                    className="pointer-events-none absolute -inset-3 rounded-[2rem] blur-2xl transition-opacity duration-500"
                    style={{ background: glow, opacity: glowing ? 0.55 : 0.25 }}
                />
                {/* 🎯 Edge glow: the gradient only shows through the 2px edge around the panel */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-[1.4rem]"
                    style={{ background: `${glow}, linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08))` }}
                />

                <div className="relative z-10 rounded-[calc(1.4rem-2px)] bg-[#0a0a0f] px-5 py-6 sm:px-7 sm:py-7 overflow-hidden">
                    {/* faint dotted texture */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
                    />

                    <div className="relative mb-6 flex items-start gap-3">
                        <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10"
                            style={{ background: `linear-gradient(135deg, ${withAlpha(borderGlowColor, '40')}, transparent)`, color: edgeColor }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">Get in touch</h2>
                            <p className="mt-0.5 text-[0.8rem] text-zinc-400">We usually reply within a day.</p>
                        </div>
                    </div>

                    <form className="relative grid grid-cols-2 gap-3" onSubmit={handleBtnClick} noValidate>
                        {fields.map(f => (
                            <div key={f.name} className={`relative ${f.half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}`}>
                                <label
                                    ref={el => (labelRefs.current[f.name] = el)}
                                    htmlFor={`edge-glow-${f.name}`}
                                    className="pointer-events-none absolute left-3.5 z-10 whitespace-nowrap text-sm"
                                >{f.label}</label>
                                <span
                                    ref={el => {
                                        if (!borderRefs.current[f.name]) borderRefs.current[f.name] = [];
                                        borderRefs.current[f.name][0] = el;
                                    }}
                                    className="pointer-events-none absolute left-1/2 top-0 z-20 h-[1.5px] w-[80%] -translate-x-1/2 rounded-full opacity-0"
                                />
                                <input
                                    id={`edge-glow-${f.name}`}
                                    type={f.type}
                                    name={f.name}
                                    value={values[f.name]}
                                    onChange={e => handleChange(e, f.name)}
                                    onFocus={() => handleFocus(f.name)}
                                    onBlur={() => handleBlur(f.name)}
                                    autoComplete="off"
                                    className={`h-[3.25rem] w-full rounded-xl border bg-white/[0.04] px-3.5 pt-4 text-sm text-white transition-colors focus:bg-white/[0.06] focus:outline-none ${errors[f.name] ? 'border-red-400/70' : 'border-white/10 hover:border-white/20'}`}
                                />
                                <span
                                    ref={el => {
                                        if (!borderRefs.current[f.name]) borderRefs.current[f.name] = [];
                                        borderRefs.current[f.name][1] = el;
                                    }}
                                    className="pointer-events-none absolute bottom-0 left-1/2 h-[1.5px] w-[80%] -translate-x-1/2 rounded-full opacity-0"
                                />
                            </div>
                        ))}

                        <div className="relative col-span-2 mt-1 flex select-none items-center gap-3">
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={checked}
                                aria-label="I agree to the terms"
                                onClick={handleCheckbox}
                                className="relative flex h-5 w-5 min-w-5 items-center justify-center rounded-md border border-white/25 bg-white/5 transition focus:outline-none focus-visible:ring-2"
                                style={{ borderColor: checked ? edgeColor : undefined, '--tw-ring-color': edgeColor }}
                            >
                                <svg ref={checkTick} width="14" height="14" viewBox="0 0 18 18" style={{ color: edgeColor }}>
                                    <polyline points="3,10 7,14 15,6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <span className="text-sm text-zinc-400">I agree to the <span className="text-zinc-200 underline decoration-white/20 underline-offset-2">terms</span></span>
                            {checkboxError && (
                                <div className="absolute -top-9 left-0 z-50 flex flex-col items-start">
                                    <div className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">Please accept the terms</div>
                                    <div className="ml-1.5 -mt-1 h-2.5 w-2.5 rotate-45 bg-red-500" />
                                </div>
                            )}
                        </div>

                        {/* Animated Submit Button */}
                        <button
                            type="submit"
                            className="relative col-span-2 mt-3 flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]"
                            style={{ background: `linear-gradient(110deg, ${GlowColor}, ${edgeColor})`, boxShadow: `0 10px 30px -12px ${edgeColor}` }}
                            disabled={btnState !== 'default'}
                        >
                            {/* Bouncing Balls */}
                            <span className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1 transition-opacity duration-200 ${btnState === 'loading' ? 'opacity-100' : 'opacity-0'}`}>
                                <span ref={ballsRef[0]} className="inline-block h-2 w-2 rounded-full bg-white/90" />
                                <span ref={ballsRef[1]} className="inline-block h-2 w-2 rounded-full bg-white/90" />
                                <span ref={ballsRef[2]} className="inline-block h-2 w-2 rounded-full bg-white/90" />
                            </span>
                            {/* Checkmark */}
                            <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${btnState === 'success' ? 'opacity-100' : 'opacity-0'}`}>
                                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                            </span>
                            {/* Default text */}
                            <span className={`flex items-center gap-2 transition-opacity duration-200 ${btnState === 'default' ? 'opacity-100' : 'opacity-0'}`}>
                                Send Message
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EdgeGlowForm;
