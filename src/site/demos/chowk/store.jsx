/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { areas, coupons, findRestaurant } from "./data";

const Ctx = createContext(null);

const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be blocked; the app still works in memory */
  }
};

const EMPTY = { restaurantId: null, items: {} };

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read("chowk.cart", EMPTY));
  const [area, setArea] = useState(() => read("chowk.area", areas[0]));
  const [pending, setPending] = useState(null); // item waiting for "start a new cart"
  const [orders, setOrders] = useState(() => read("chowk.orders", []));

  useEffect(() => write("chowk.cart", cart), [cart]);
  useEffect(() => write("chowk.area", area), [area]);
  useEffect(() => write("chowk.orders", orders), [orders]);

  const add = (restaurantId, item) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId && Object.keys(cart.items).length) {
      setPending({ restaurantId, item });
      return;
    }
    setCart((c) => {
      const prev = c.items[item.id];
      return {
        restaurantId,
        items: { ...c.items, [item.id]: { ...item, qty: (prev?.qty || 0) + 1 } },
      };
    });
  };

  const remove = (itemId) =>
    setCart((c) => {
      const prev = c.items[itemId];
      if (!prev) return c;
      const items = { ...c.items };
      if (prev.qty <= 1) delete items[itemId];
      else items[itemId] = { ...prev, qty: prev.qty - 1 };
      return Object.keys(items).length ? { ...c, items } : EMPTY;
    });

  const confirmReplace = () => {
    if (!pending) return;
    setCart({ restaurantId: pending.restaurantId, items: { [pending.item.id]: { ...pending.item, qty: 1 } } });
    setPending(null);
  };

  const clear = () => setCart(EMPTY);

  const lines = Object.values(cart.items);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const restaurant = cart.restaurantId ? findRestaurant(cart.restaurantId) : null;

  const placeOrder = (details) => {
    const id = String(Date.now()).slice(-7);
    const order = { id, placedAt: Date.now(), restaurantId: cart.restaurantId, lines, ...details };
    setOrders((o) => [order, ...o].slice(0, 10));
    clear();
    return id;
  };

  const value = useMemo(
    () => ({ cart, lines, count, subtotal, restaurant, add, remove, clear, pending, setPending, confirmReplace, area, setArea, orders, placeOrder }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, area, pending, orders]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

export const qtyOf = (cart, itemId) => cart.items[itemId]?.qty || 0;

// Bill maths shared by checkout and tracking.
export function bill(subtotal, distance = 2, couponCode = null) {
  const coupon = coupons.find((c) => c.code === couponCode);
  let delivery = subtotal === 0 ? 0 : Math.round(25 + distance * 6);
  let discount = 0;
  if (coupon && subtotal >= coupon.min) {
    if (coupon.type === "pct") discount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.cap);
    if (coupon.type === "flat") discount = coupon.value;
    if (coupon.type === "delivery") delivery = 0;
  }
  const platform = subtotal ? 5 : 0;
  const gst = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount + delivery + platform + gst);
  return { delivery, discount, platform, gst, total, coupon };
}

export const rupees = (n) => `₹${n.toLocaleString("en-IN")}`;
