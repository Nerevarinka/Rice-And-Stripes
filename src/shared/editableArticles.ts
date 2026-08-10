import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { Article } from "@/models";
import type { EditableArticle } from "@/models/editableArticle";
import { withBasePath } from "@/shared/utils/withBasePath";
import { calculateReadingTimeMinutes } from "@/shared/utils/readingTime";

const ARTICLES_DIR = path.join(process.cwd(), "data", "articles");

async function readEditableArticleFile(fileName: string): Promise<EditableArticle | null> {
    try {
        const filePath = path.join(ARTICLES_DIR, fileName);
        const raw = await readFile(filePath, "utf8");
        return JSON.parse(raw) as EditableArticle;
    } catch {
        return null;
    }
}

function normalizeAssetUrl(url: string) {
    if (!url) {
        return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }

    if (url.startsWith("/Rice-And-Stripes/")) {
        return url;
    }

    if (url.startsWith("/")) {
        return withBasePath(url);
    }

    return withBasePath(`/${url}`);
}

export async function getEditableArticles(): Promise<EditableArticle[]> {
    try {
        const fileNames = await readdir(ARTICLES_DIR);

        const articles = await Promise.all(
            fileNames
                .filter(fileName => fileName.endsWith(".json"))
                .map(fileName => readEditableArticleFile(fileName))
        );

        return articles
            .filter((article): article is EditableArticle => article !== null)
            .sort(
                (left, right) =>
                    new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime()
            );
    } catch {
        return [];
    }
}

export async function getEditableArticleBySlug(slug: string): Promise<EditableArticle | null> {
    if (!/^[a-z0-9-]+$/.test(slug)) {
        return null;
    }

    const article = await readEditableArticleFile(`${slug}.json`);
    return article?.slug === slug ? article : null;
}

export function editableArticleToCard(article: EditableArticle): Article {
    const coverUrl = normalizeAssetUrl(article.coverUrl);

    return {
        caption: article.title,
        link: `/articles/${article.slug}`,
        cover: coverUrl,
        description: article.description,
        publishDate: new Date(article.publishDate),
        updatedAt: article.updatedAt ? new Date(article.updatedAt) : undefined,
        tags: article.tags,
        readingTimeMinutes: article.readingTimeMinutes
            ?? calculateReadingTimeMinutes(article.blocks ?? []),
    };
}

export function normalizeEditableArticleAssetUrl(url: string) {
    return normalizeAssetUrl(url);
}
