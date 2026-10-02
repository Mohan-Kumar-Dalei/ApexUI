export const OPEN_SEARCH_EVENT = 'apexui:open-search';

export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
