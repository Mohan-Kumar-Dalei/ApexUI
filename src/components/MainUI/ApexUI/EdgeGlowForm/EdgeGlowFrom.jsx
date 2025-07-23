"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'mobile', label: 'Mobile Number', type: 'tel' },
];

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

    // Mouse movement for glassy background
    const [radialPos, setRadialPos] = useState({ x: 50, y: 50 });
    const bgRef = useRef();

    const handleBgMouseMove = e => {
        if (!bgRef.current) return;
        const rect = bgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setRadialPos({ x, y });
    };
    const handleBgMouseLeave = () => {
        setRadialPos({ x: 50, y: 50 });
    };

    const floatLabel = (name, up, color = null) => {
        const label = labelRefs.current[name];
        if (label) {
            gsap.to(label, {
                top: up ? '-2px' : '23%',
                left: '5px',
                scale: up ? 0.85 : 1,
                color: color ?? (up ? '#a78bfa' : '#bdbdbd'),
                transform: 'translateY(-4%)',
                fontWeight: up ? 500 : 400,
                duration: 0.2,
                ease: 'easeInOut',
                zIndex: 10,
            });
        }
    };

    const showBorder = (name, show, color = '#a78bfa88') => {
        const [top, bottom] = borderRefs.current[name] || [];
        [top, bottom].forEach(border => {
            if (border) {
                gsap.to(border, {
                    opacity: show ? 1 : 0,
                    scaleX: show ? 1 : 0.7,
                    background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                    boxShadow: `0 0 8px 0 ${color.replace('88', '33')}`,
                    duration: 0.2,
                    ease: show ? 'ease.out' : 'ease.in',
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
        if (v) floatLabel(name, true);
        else if (focused !== name) floatLabel(name, false);
    };

    useEffect(() => {
        fields.forEach(f => {
            const [top, bottom] = borderRefs.current[f.name] || [];
            if (top) gsap.set(top, { opacity: 0, scaleX: 0.7 });
            if (bottom) gsap.set(bottom, { opacity: 0, scaleX: 0.7 });
            if (labelRefs.current[f.name]) gsap.set(labelRefs.current[f.name], {
                top: '23%',
                left: '5px',
                scale: 1,
                color: '#bdbdbd',
                transform: 'translateY(-4%)',
                fontWeight: 400,
                position: 'absolute',
                pointerEvents: 'none',
                backgroundColor: '',
                padding: '0 4px',
                zIndex: 10,
            });
        });
    }, []);

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
                y: -12,
                repeat: -1,
                yoyo: true,
                delay: i * 0.12,
                duration: 0.38,
                ease: 'power1.inOut',
            });
        });
        setTimeout(() => {
            setBtnState('success');
            ballsRef.forEach(ref => gsap.set(ref.current, { y: 0 }));
            setTimeout(() => {
                setBtnState('default');
            }, 1200);
        }, 1600);
    };

    return (

        <div className=" rounded-xl">
            <div
                className="w-full max-w-sm mx-auto  rounded-xl shadow-2xl p-1 flex flex-col justify-center text-white relative overflow-hidden"
                ref={bgRef}
                onMouseMove={handleBgMouseMove}
                onMouseLeave={handleBgMouseLeave}
            >
                {/* 🎯 Glassy Background */}
                <div className="absolute inset-0 z-0 hidden md:block pointer-events-none rounded-xl">
                    <div
                        className="absolute inset-0 opacity-95"
                        style={{
                            background: `radial-gradient(circle at ${radialPos.x}% ${radialPos.y}%, ${GlowColor} 10%, transparent 60%)`
                        }}
                    ></div>
                </div>
                <div className={`relative z-10 bg-black h-full w-full p-6 border border-purple-600 rounded-xl`}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-purple-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75" />
                        </svg>
                        Get In Touch
                    </h2>
                    <form className="space-y-6 w-full" onSubmit={handleBtnClick}>
                        {fields.map(f => (
                            <div key={f.name} className="relative flex flex-col justify-center">
                                <label
                                    ref={el => (labelRefs.current[f.name] = el)}
                                    className="absolute text-white/60 text-sm transition-all pointer-events-none"
                                >{f.label}</label>
                                <span
                                    ref={el => {
                                        if (!borderRefs.current[f.name]) borderRefs.current[f.name] = [];
                                        borderRefs.current[f.name][0] = el;
                                    }}
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[80%] h-[2px] rounded-full opacity-0 scale-x-70 origin-center z-20"
                                    style={{
                                        background: `linear-gradient(90deg, transparent 0%, yellow 20%, transparent 100%)`,
                                        boxShadow: `0 0 8px 0 ${borderGlowShadow}`,
                                    }}
                                />
                                <input
                                    type={f.type}
                                    name={f.name}
                                    value={values[f.name]}
                                    onChange={e => handleChange(e, f.name)}
                                    onFocus={() => handleFocus(f.name)}
                                    onBlur={() => handleBlur(f.name)}
                                    autoComplete="off"
                                    className={`w-full px-4 pt-5 pb-2 rounded-lg bg-white/10 border ${errors[f.name] ? 'border-red-400' : 'border-white/20'} text-sm text-white focus:outline-none backdrop-blur-md transition font-light`}
                                />
                                <span
                                    ref={el => {
                                        if (!borderRefs.current[f.name]) borderRefs.current[f.name] = [];
                                        borderRefs.current[f.name][1] = el;
                                    }}
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 w-[80%] h-[2px] rounded-full opacity-0 scale-x-70 origin-center"
                                    style={{
                                        background: `linear-gradient(90deg, transparent 0%, ${borderGlowColor} 20%, transparent 100%)`,
                                        boxShadow: `0 0 8px 0 ${borderGlowShadow}`,
                                    }}
                                />
                            </div>
                        ))}

                        <div className="flex items-center gap-3 mt-2 select-none relative">
                            <button
                                type="button"
                                aria-checked={checked}
                                tabIndex={0}
                                onClick={handleCheckbox}
                                className={`relative w-6 h-6 rounded-md border-2 border-white/30 bg-white/10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-400 transition`}
                                style={{ minWidth: 24 }}
                            >
                                <svg
                                    ref={checkTick}
                                    width="18" height="18" viewBox="0 0 18 18"
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400"
                                    style={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0, transition: 'all 0.2s' }}
                                >
                                    <polyline points="3,10 7,14 15,6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <span className="text-white/80 text-sm">I agree to the terms</span>
                            {checkboxError && (
                                <div className="absolute -left-0 -top-10 flex flex-col items-center " style={{ zIndex: 999 }}>
                                    <div className="bg-red-500 text-white text-xs rounded px-3 py-1 shadow-lg font-medium">check this box</div>
                                    <div className="w-3 h-3 bg-red-500 rotate-135 -mt-1" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
                                </div>
                            )}
                        </div>
                        {/* Animated Submit Button */}
                        <button
                            type="submit"
                            className="mt-6 py-3 px-6 bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-800 rounded-md hover:brightness-110 transition shadow-lg w-full font-semibold text-base flex items-center justify-center gap-2 relative overflow-hidden"
                            style={{ minHeight: 48 }}
                            onClick={handleBtnClick}
                            disabled={btnState !== 'default'}
                        >
                            {/* Bouncing Balls */}
                            <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 ${btnState === 'loading' ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.2s' }}>
                                <span ref={ballsRef[0]} className="w-2.5 h-2.5 rounded-full bg-white/80 inline-block" />
                                <span ref={ballsRef[1]} className="w-2.5 h-2.5 rounded-full bg-white/80 inline-block" />
                                <span ref={ballsRef[2]} className="w-2.5 h-2.5 rounded-full bg-white/80 inline-block" />
                            </span>
                            {/* Checkmark */}
                            <span
                                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-green-400 ${btnState === 'success' ? 'opacity-100' : 'opacity-0'}`}
                                style={{ transition: 'opacity 0.2s' }}
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                            </span>
                            {/* Default text */}
                            <span className={`transition-opacity duration-200 ${btnState === 'default' ? 'opacity-100' : 'opacity-0'}`}>Send Message</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default EdgeGlowForm;
