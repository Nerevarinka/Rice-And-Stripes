import "server-only";

import type { Article, SearchItem, SidebarItem } from "@/models";

import { editableArticleToCard, getEditableArticles } from "@/shared/editableArticles";
import { notes } from "@/shared/notes";
import { editableNoteToCard, getEditableNotes } from "@/shared/editableNotes";

export async function getAllArticleCards(): Promise<Article[]> {
    const editableArticles = await getEditableArticles();
    const editableCards = editableArticles.map(editableArticleToCard);

    return editableCards
        .sort((left, right) => right.publishDate.getTime() - left.publishDate.getTime());
}

export async function getAllSidebarItems(): Promise<SidebarItem[]> {
    const articles = await getAllArticleCards();
    const editableNotes = await getEditableNotes();
    const allNotes = [...notes, ...editableNotes.map(editableNoteToCard)]
        .sort((left, right) => right.publishDate.getTime() - left.publishDate.getTime());
    const isProduction = process.env.NODE_ENV === "production";

    const items: SidebarItem[] = [
        {
            caption: "Статьи",
            link: "/articles",
            isGroup: true,
            children: articles.map(article => ({
                caption: article.caption,
                link: article.link,
            })),
        },
        {
            caption: "Заметки",
            link: "/notes",
            isGroup: true,
            children: allNotes.map(note => ({
                caption: note.caption || "Заметка",
                link: note.link,
            })),
        },
        {
            caption: "Мои амадины",
            link: "/finches",
            isGroup: false,
        },
        {
            caption: "Об авторе",
            link: "/about",
            isGroup: false,
        },
    ];

    if (!isProduction) {
        items.push({
            caption: "Админка",
            link: "/admin/create",
            isGroup: false,
        });
    }

    return items;
}

function compactSearchText(value: string) {
    const words = value
        .toLocaleLowerCase("ru-RU")
        .replace(/ё/g, "е")
        .match(/[a-zа-я0-9]+(?:-[a-zа-я0-9]+)*/gi) ?? [];

    return Array.from(new Set(words.filter(word => word.length >= 2))).join(" ");
}

export async function getSiteSearchItems(): Promise<SearchItem[]> {
    const articles = await getAllArticleCards();
    const editableArticles = await getEditableArticles();
    const editableBySlug = new Map(editableArticles.map(article => [article.slug, article]));

    const articleItems = await Promise.all(articles.map(async article => {
        const slug = article.link.split("/").filter(Boolean).at(-1) ?? "";
        const editableArticle = editableBySlug.get(slug);
        const body = editableArticle ? JSON.stringify(editableArticle.blocks ?? []) : "";

        return {
            title: article.caption,
            description: article.description,
            link: article.link,
            kind: "Статья" as const,
            searchText: compactSearchText(`${article.caption} ${article.description} ${body}`),
            publishDate: article.publishDate.toISOString(),
        };
    }));

    const editableNotes = await getEditableNotes();
    const allNotes = [...notes, ...editableNotes.map(editableNoteToCard)];
    const editableNotesBySlug = new Map(editableNotes.map(note => [note.slug, note]));
    const noteItems: SearchItem[] = allNotes.map(note => {
        const slug = note.link.split("/").filter(Boolean).at(-1) ?? "";
        const editableNote = editableNotesBySlug.get(slug);
        return {
        title: note.caption || "Заметка",
        description: note.description,
        link: note.link,
        kind: "Заметка",
        searchText: compactSearchText(`${note.caption ?? ""} ${note.description} ${JSON.stringify(editableNote?.blocks ?? [])}`),
        publishDate: note.publishDate.toISOString(),
        };
    });

    const sectionItems: SearchItem[] = [
        {
            title: "Мои амадины",
            description: "Фотографии и истории птиц, которые живут или жили со мной.",
            link: "/finches",
            kind: "Раздел",
            searchText: "мои амадины птицы фотографии истории характеры привычки",
        },
        {
            title: "Об авторе",
            description: "Об авторе блога Rice & Stripes и его истории.",
            link: "/about",
            kind: "Раздел",
            searchText: "об авторе блог проект Rice Stripes",
        },
    ];

    return [...articleItems, ...noteItems, ...sectionItems];
}
