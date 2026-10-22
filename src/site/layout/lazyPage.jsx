import { lazy, Suspense } from 'react';
import PageLoader from './PageLoader.jsx';

/*
 * A route element that renders straight away and loads its page code inside
 * a Suspense boundary, so navigation is instant and the centered PageLoader
 * covers the wait instead of the old page staying up.
 */
export function lazyPage(load) {
    const Page = lazy(load);
    function LazyPage() {
        return (
            <Suspense fallback={<PageLoader />}>
                <Page />
            </Suspense>
        );
    }
    return <LazyPage />;
}
