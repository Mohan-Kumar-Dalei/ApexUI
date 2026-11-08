// Every Chowk page lives under /demos/chowk inside the ApexUI site.
export const BASE = "/demos/chowk";
export const href = (path = "/") => (path === "/" ? BASE : `${BASE}${path}`);
