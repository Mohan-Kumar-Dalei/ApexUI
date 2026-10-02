/* Global open/close events for the overlays mounted once in AppShell. */

export const OPEN_SEARCH_EVENT = 'apexui:open-search';
export const OPEN_FEEDBACK_EVENT = 'apexui:open-feedback';
export const OPEN_INDEX_EVENT = 'apexui:open-index';

export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
export const openFeedback = () => window.dispatchEvent(new Event(OPEN_FEEDBACK_EVENT));
export const openIndex = () => window.dispatchEvent(new Event(OPEN_INDEX_EVENT));
