/*
 * Default themes for ThemeSwitcher, plus helpers to apply one and to inline
 * a no-flash script in index.html. Each theme sets seven CSS variables on
 * <html>: --bg, --surface, --ink, --muted, --line, --accent, --accent-ink.
 */

const t = (id, name, scheme, bg, surface, ink, muted, line, accent, accentInk) => ({
    id,
    name,
    scheme,
    vars: { "--bg": bg, "--surface": surface, "--ink": ink, "--muted": muted, "--line": line, "--accent": accent, "--accent-ink": accentInk },
});

export const defaultThemes = [
    t("sunrise", "Sunrise", "light", "#f4f2ed", "#ffffff", "#121110", "#6f6b64", "rgb(18 17 16 / .12)", "#ff5b1f", "#ffffff"),
    t("ember", "Ember", "dark", "#0e0d0c", "#171615", "#f1efe9", "#9a958c", "rgb(241 239 233 / .12)", "#ff7a3d", "#120a05"),
    t("paper", "Paper", "light", "#fafaf7", "#ffffff", "#111111", "#6b6b66", "rgb(17 17 17 / .12)", "#111111", "#fafaf7"),
    t("noir", "Noir", "dark", "#0c0c0c", "#161616", "#f5f5f2", "#8f8f8a", "rgb(245 245 242 / .12)", "#f5f5f2", "#0c0c0c"),
    t("meadow", "Meadow", "light", "#f2f7ef", "#ffffff", "#10200f", "#5d6f5a", "rgb(16 32 15 / .12)", "#2fb562", "#ffffff"),
    t("matrix", "Matrix", "dark", "#07110a", "#0d1a11", "#d7f5dd", "#6f9a78", "rgb(215 245 221 / .12)", "#4ade80", "#04130a"),
    t("ocean", "Ocean", "light", "#eef3fa", "#ffffff", "#0c1a2b", "#5b6b80", "rgb(12 26 43 / .12)", "#2563eb", "#ffffff"),
    t("grape", "Grape", "dark", "#0f0b1a", "#181229", "#ece8f7", "#9890b0", "rgb(236 232 247 / .12)", "#a78bfa", "#140d24"),
];

export function applyTheme(theme, root = typeof document !== "undefined" ? document.documentElement : null) {
    if (!theme || !root) return;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute("data-theme", theme.id);
    root.setAttribute("data-scheme", theme.scheme);
    root.style.colorScheme = theme.scheme;
}

// A string to inline in <head> (before your app script) so the saved theme
// is applied before React loads: no flash of the wrong colours.
export function themeScript(storageKey = "theme", themes = defaultThemes) {
    const data = JSON.stringify(themes.map(({ id, scheme, vars }) => ({ id, scheme, vars })));
    return `(function(){try{var T=${data};var id=localStorage.getItem(${JSON.stringify(storageKey)});var t=T.find(function(x){return x.id===id});if(!t)return;var r=document.documentElement;for(var k in t.vars)r.style.setProperty(k,t.vars[k]);r.setAttribute("data-theme",t.id);r.setAttribute("data-scheme",t.scheme);r.style.colorScheme=t.scheme;}catch(e){}})();`;
}
