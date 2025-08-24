// screenSizes.js
// Centralized screen size logic for responsive breakpoints

import React from 'react';

export const SCREEN_SIZES = {
    EXTRASMALL: {
        min: 310,
        max: 375,
        query: '(min-width:310px) and (max-width:375px)'
    },

    MOBILE: {
        min: 376,
        max: 767,
        query: '(min-width:376px) and (max-width:767px)'
    },
    TABLET: {
        min: 768,
        max: 1079,
        query: '(min-width:768px) and (max-width:1079px)'
    },
    LARGE: {
        min: 1081,
        max: 2720,
        query: '(min-width:1081px) and (max-width:2720px)'
    },
    FIXING:{
        min: 1024,
        max: 1080,
        query: '(min-width:1024px) and (max-width:1080px)'
    }
};

export function getScreenType(width) {
    if (width >= SCREEN_SIZES.MOBILE.min && width <= SCREEN_SIZES.MOBILE.max) {
        return 'mobile';
    }
    if (width >= SCREEN_SIZES.TABLET.min && width <= SCREEN_SIZES.TABLET.max) {
        return 'tablet';
    }
    if (width >= SCREEN_SIZES.LARGE.min && width <= SCREEN_SIZES.LARGE.max) {
        return 'large';
    }
    if (width >= SCREEN_SIZES.EXTRASMALL.min && width <= SCREEN_SIZES.EXTRASMALL.max) {
        return 'EXTRASMALL';
    }
    if (width >= SCREEN_SIZES.FIXING.min && width <= SCREEN_SIZES.FIXING.max) {
        return 'FIXING';
    }
    return 'unknown';
}

export function useScreenType() {
    const [screenType, setScreenType] = React.useState(getScreenType(window.innerWidth));
    React.useEffect(() => {
        const handleResize = () => {
            setScreenType(getScreenType(window.innerWidth));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return screenType;
}
