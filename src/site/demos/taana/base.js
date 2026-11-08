// Every Taana page lives under /demos/taana inside the ApexUI site.
export const BASE = '/demos/taana';
export const u = (path = '/') => (path === '/' ? BASE : `${BASE}${path.startsWith('/#') ? path.slice(1) : path}`);
export const isPage = (pathname, path) => pathname.replace(/\/$/, '') === u(path.split('#')[0] || '/');
