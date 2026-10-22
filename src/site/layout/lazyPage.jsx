/*
 * Route-level code splitting. React Router loads the page's code *before* it
 * switches routes, so the current page stays on screen until the next one is
 * ready and swaps in whole — no blank frame or fallback flash in between.
 * Slow loads are covered by the NavigationLoader overlay (see AppShell).
 */
export function lazyRoute(load) {
    return {
        lazy: async () => {
            const mod = await load();
            return { Component: mod.default };
        },
    };
}
