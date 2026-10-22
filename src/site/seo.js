/*
 * Per-route SEO for the single-page app: every navigation rewrites the title,
 * description, canonical URL, Open Graph / Twitter tags and a breadcrumb
 * JSON-LD block, so each page is indexed and shared with its own details
 * (index.html only carries the home page's defaults).
 */

export const SITE_URL = 'https://apex-ui.in';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const setMeta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

const setCanonical = (href) => {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
    }
    el.href = href;
};

const setJsonLd = (data) => {
    let el = document.getElementById('route-jsonld');
    if (!data) return el?.remove();
    if (!el) {
        el = document.createElement('script');
        el.type = 'application/ld+json';
        el.id = 'route-jsonld';
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
};

const breadcrumbs = (trail) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name,
        item: `${SITE_URL}${path}`,
    })),
});

/*
 * Works out the SEO fields for a route from its router handle:
 *   handle.page        – a docs page from navigation.js (name, summary, path)
 *   handle.description – a hand-written description (home, gallery …)
 *   handle.noindex     – keep the page out of search results (404)
 */
export function seoForRoute(handle, pathname) {
    const page = handle.page;
    if (page) {
        const isGuide = page.path.includes('/docs/');
        const description = isGuide
            ? `${page.summary ?? `${page.name} guide.`} ApexUI docs.`
            : `${page.summary} Free animated React component for Tailwind CSS.`; // ≤ ~160 chars for search snippets
        return {
            title: isGuide ? `${page.name} | ApexUI Docs` : `${page.name} | Animated React Component | ApexUI`,
            description,
            path: page.path,
            image: page.ogImage,
            jsonLd: breadcrumbs([['Home', '/'], [isGuide ? 'Docs' : 'Components', '/components'], [page.name, page.path]]),
        };
    }
    return {
        title: handle.title ?? 'ApexUI',
        description: handle.description,
        path: pathname,
        noindex: handle.noindex,
    };
}

export function applySeo({ title, description, path, image, noindex, jsonLd }) {
    const url = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/+$/, '')}`;
    document.title = title;
    if (description) {
        setMeta('name', 'description', description);
        setMeta('property', 'og:description', description);
        setMeta('name', 'twitter:description', description);
    }
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image ?? DEFAULT_IMAGE);
    setMeta('name', 'twitter:image', image ?? DEFAULT_IMAGE);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setCanonical(url);
    setJsonLd(jsonLd);
}
