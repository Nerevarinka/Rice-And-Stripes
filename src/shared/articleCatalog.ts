import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Article, SidebarItem } from "@/models";

import { articles as staticArticles } from "@/shared/articles";
import { editableArticleToCard, getEditableArticles } from "@/shared/editableArticles";
import { calculateReadingTimeFromWordCount } from "@/shared/utils/readingTime";

export async function getStaticArticleReadingTime(slug: string) {
    if (!slug || !/^[a-zA-Z0-9-]+$/.test(slug)) {
        return undefined;
    }

    try {
        const source = await readFile(
            path.join(process.cwd(), "src", "app", "(pages)", "articles", slug, "article.tsx"),
            "utf8"
        );
        const russianWords = source.match(/[а-яё]+(?:-[а-яё]+)*/giu)?.length ?? 0;

        return calculateReadingTimeFromWordCount(russianWords);
    } catch {
        return undefined;
    }
}

async function addStaticReadingTime(article: Article): Promise<Article> {
    const slug = article.link.split("/").filter(Boolean).at(-1);
    const readingTimeMinutes = slug ? await getStaticArticleReadingTime(slug) : undefined;

    return readingTimeMinutes ? { ...article, readingTimeMinutes } : article;
}

export async function getAllArticleCards(): Promise<Article[]> {
    const staticCards = await Promise.all(staticArticles.map(addStaticReadingTime));
    const editableArticles = await getEditableArticles();
    const editableCards = editableArticles
        .filter(article => article.status === "published")
        .map(editableArticleToCard);

    return [...staticCards, ...editableCards]
        .filter((article, index, array) => array.findIndex(item => item.link === article.link) === index)
        .sort((left, right) => right.publishDate.getTime() - left.publishDate.getTime());
}

export async function getAllSidebarItems(): Promise<SidebarItem[]> {
    const articles = await getAllArticleCards();
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
