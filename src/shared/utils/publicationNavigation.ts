export type PublicationNavigationEntry = {
    title: string;
    link: string;
};

export function getPublicationNavigation(
    publications: PublicationNavigationEntry[],
    currentLink: string
) {
    const currentIndex = publications.findIndex(publication => publication.link === currentLink);

    if (currentIndex === -1) {
        return { previousItem: undefined, nextItem: undefined };
    }

    return {
        previousItem: currentIndex > 0 ? publications[currentIndex - 1] : undefined,
        nextItem: currentIndex < publications.length - 1 ? publications[currentIndex + 1] : undefined,
    };
}
