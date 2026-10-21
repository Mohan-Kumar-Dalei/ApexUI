/* Global open/close events for the overlays mounted once in AppShell. */

export const OPEN_SEARCH_EVENT = 'apexui:open-search';
export const OPEN_FEEDBACK_EVENT = 'apexui:open-feedback';
export const OPEN_INDEX_EVENT = 'apexui:open-index';

export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
export const openFeedback = () => window.dispatchEvent(new Event(OPEN_FEEDBACK_EVENT));
export const openIndex = () => window.dispatchEvent(new Event(OPEN_INDEX_EVENT));

/*
 * Framer props for the dimmed, blurred backdrop behind an overlay. The tint and
 * blur are animated directly; fading a backdrop-filter element's opacity makes
 * Chrome snap the blur in at the end, which shows up as a flicker.
 */
const hidden = { backgroundColor: 'rgba(0, 0, 0, 0)', backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' };
export const backdropMotion = {
    initial: hidden,
    animate: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' },
    exit: hidden,
};
