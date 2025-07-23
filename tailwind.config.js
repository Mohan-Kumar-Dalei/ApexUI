// tailwind.config.js
export const content = [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
];
import scrollbarHide from 'tailwind-scrollbar-hide';

const config = {
    extend: {
        animation: {
            shine: 'shine 2s linear infinite',
        },
        blur: {
            100: '100px',
            120: '120px',
            160: '160px',
        },
        plugins: [
            scrollbarHide
        ],
        keyframes: {
            shine: {
                '0%': { backgroundPosition: '200% center' },
                '100%': { backgroundPosition: '0% center' },
            },
        },
    },
};

export default config;

export const plugins = [
    function ({ addUtilities }) {
        addUtilities({
            '.text-stroke-1': {
                '-webkit-text-stroke': '1px currentColor',
            },
            '.text-stroke-2': {
                '-webkit-text-stroke': '2px currentColor',
            },
            '.text-stroke-white': {
                '-webkit-text-stroke-color': '#fff',
            },
            '.text-fill-none': {
                '-webkit-text-fill-color': 'transparent',
            },
        });
    },
];
