import type { MetadataRoute } from "next";

import { getAllArticleCards } from "@/shared/articleCatalog";
import { getEditableNotes, editableNoteToCard } from "@/shared/editableNotes";
import { notes } from "@/shared/notes";

const SITE_URL = "https://nerevarinka.github.io/Rice-And-Stripes";

export const dynamic = "force-static";

function absoluteUrl(pathname: string) {
    const normalizedPath = pathname === "/" ? "" : pathname;
    return `${SITE_URL}${normalizedPath}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [articles, editableNotes] = await Promise.all([
        getAllArticleCards(),
        getEditableNotes(),
    ]);
    const allNotes = [...notes, ...editableNotes.map(editableNoteToCard)]
        .filter((note, index, items) => items.findIndex(item => item.link === note.link) === index);

    return [
        {
            url: absoluteUrl("/"),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: absoluteUrl("/articles"),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...articles.map(article => ({
            url: absoluteUrl(article.link),
            lastModified: article.updatedAt ?? article.publishDate,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
        {
            url: absoluteUrl("/notes"),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        ...allNotes.map(note => ({
            url: absoluteUrl(note.link),
            lastModified: note.updatedAt ?? note.publishDate,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        {
            url: absoluteUrl("/finches"),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: absoluteUrl("/about"),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];
}
