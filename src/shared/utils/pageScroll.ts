const mobileMediaQuery = "(max-width: 767.98px)";

export const usesDocumentScroll = () => window.matchMedia(mobileMediaQuery).matches;

export const getPageScrollElement = (scrollContainer: HTMLElement) => {
    if (!usesDocumentScroll()) return scrollContainer;

    return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
};

export const scrollPageToTop = (scrollContainer: HTMLElement, behavior: ScrollBehavior = "smooth") => {
    if (usesDocumentScroll()) {
        window.scrollTo({ top: 0, behavior });
        return;
    }

    scrollContainer.scrollTo({ top: 0, behavior });
};
