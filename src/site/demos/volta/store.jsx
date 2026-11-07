/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer } from 'react';

/*
 * Volta's cart: one reducer and a context, so any part of the page (product cards,
 * the nav badge, the drawer) can read it or change it.
 */

export const PRODUCTS = [
    { id: 'signal-tee', name: 'Signal tee', cat: 'Tops', price: 1899, img: 'photo-1529139574466-a303027c1d8b', pos: '50% 45%', colour: 'Red' },
    { id: 'overshirt', name: 'Denim overshirt', cat: 'Outerwear', price: 4499, img: 'photo-1517841905240-472988babdf9', pos: '50% 70%', colour: 'Washed blue' },
    { id: 'track-pant', name: 'Track pant', cat: 'Bottoms', price: 2999, img: 'photo-1515886657613-9f3515b0c78f', pos: '50% 60%', colour: 'Yolk' },
    { id: 'crop-knit', name: 'Crop knit', cat: 'Tops', price: 1999, img: 'photo-1469334031218-e382a71b716b', pos: '50% 60%', colour: 'Pool' },
    { id: 'stripe-trouser', name: 'Stripe trouser', cat: 'Bottoms', price: 3499, img: 'photo-1509631179647-0177331693ae', pos: '50% 75%', colour: 'Black and white' },
    { id: 'long-coat', name: 'Wool long coat', cat: 'Outerwear', price: 7999, img: 'photo-1483985988355-763728e1935b', pos: '50% 40%', colour: 'Burgundy' },
    { id: 'grey-hood', name: 'Heavy hoodie', cat: 'Tops', price: 3299, img: 'photo-1517841905240-472988babdf9', pos: '50% 20%', colour: 'Ash' },
    { id: 'round-shades', name: 'Round shades', cat: 'Accessories', price: 1499, img: 'photo-1469334031218-e382a71b716b', pos: '50% 18%', colour: 'Tortoise' },
];

export const CATS = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
export const FREE_SHIPPING = 4999;
export const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

function reducer(state, action) {
    switch (action.type) {
        case 'add': {
            const key = `${action.id}:${action.size}`;
            const found = state.items.find((i) => i.key === key);
            const items = found ? state.items.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)) : [...state.items, { key, id: action.id, size: action.size, qty: 1 }];
            return { ...state, items, last: { key, at: Date.now() } };
        }
        case 'qty':
            return { ...state, items: state.items.map((i) => (i.key === action.key ? { ...i, qty: Math.max(0, i.qty + action.by) } : i)).filter((i) => i.qty > 0) };
        case 'remove':
            return { ...state, items: state.items.filter((i) => i.key !== action.key) };
        case 'open':
            return { ...state, open: action.open };
        default:
            return state;
    }
}

const Cart = createContext(null);

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, { items: [], open: false, last: null });
    const value = useMemo(() => {
        const lines = state.items.map((i) => ({ ...i, product: PRODUCTS.find((p) => p.id === i.id) }));
        const count = lines.reduce((n, l) => n + l.qty, 0);
        const total = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
        return { ...state, lines, count, total, dispatch };
    }, [state]);
    return <Cart.Provider value={value}>{children}</Cart.Provider>;
}

export const useCart = () => useContext(Cart);
