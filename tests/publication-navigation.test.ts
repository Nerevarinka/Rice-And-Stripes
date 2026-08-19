import { describe, expect, it } from "vitest";

import { getPublicationNavigation } from "@/shared/utils/publicationNavigation";

const publications = [
    { title: "Новая", link: "/articles/new" },
    { title: "Средняя", link: "/articles/middle" },
    { title: "Старая", link: "/articles/old" },
];

describe("навигация между публикациями", () => {
    it("возвращает обоих соседей для средней публикации", () => {
        expect(getPublicationNavigation(publications, "/articles/middle")).toEqual({
            previousItem: publications[0],
            nextItem: publications[2],
        });
    });

    it("не выдумывает предыдущую или следующую публикацию на краях", () => {
        expect(getPublicationNavigation(publications, "/articles/new").previousItem).toBeUndefined();
        expect(getPublicationNavigation(publications, "/articles/old").nextItem).toBeUndefined();
    });

    it("возвращает пустую навигацию для неизвестного адреса", () => {
        expect(getPublicationNavigation(publications, "/articles/missing")).toEqual({
            previousItem: undefined,
            nextItem: undefined,
        });
    });
});
