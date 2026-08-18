import { Metadata } from "next";

import { Article } from "@/models";
import packageJson from "../../../package.json";
import { absoluteSiteUrl } from "@/shared/siteConfig";

/**
 * Общие настройки метаданных для статей
 */
const COMMON_ARTICLE_METADATA = {
    siteName: packageJson.displayName,
    locale: "ru_RU" as const,
    author: { name: "Nerevarinka" },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
        },
    },
} as const;

/**
 * Создает базовые метаданные для страниц с общими настройками
 * @param title - Заголовок страницы
 * @param description - Описание страницы
 * @param keywords - Массив ключевых слов для SEO
 * @returns Объект метаданных Next.js
 */
export const createCommonMetadata = (
    title: string,
    description: string,
    keywords: string[],
): Metadata => ({
    title,
    description,
    keywords,
    authors: [COMMON_ARTICLE_METADATA.author],
    openGraph: {
        locale: COMMON_ARTICLE_METADATA.locale,
        siteName: COMMON_ARTICLE_METADATA.siteName,
    },
    robots: COMMON_ARTICLE_METADATA.robots,
});

/**
 * Создает метаданные для статьи с расширенными настройками Open Graph и Twitter Card
 * @param articleInfo - Объект с информацией о статье
 * @param keywords - Массив ключевых слов для SEO
 * @returns Объект метаданных Next.js с настройками для социальных сетей
 */
export function createArticleMetadata(
    articleInfo: Article,
    keywords: string[]
): Metadata {
    const articleUrl = absoluteSiteUrl(articleInfo.link);
    const coverUrl = typeof articleInfo.cover === "string"
            ? absoluteSiteUrl(articleInfo.cover)
        : "src" in articleInfo.cover
            ? articleInfo.cover.src
            : articleInfo.cover.default.src;

    const baseMetadata = createCommonMetadata(
        articleInfo.caption,
        articleInfo.description,
        keywords
    );

    return {
        ...baseMetadata,
        openGraph: {
            ...baseMetadata.openGraph,
            title: articleInfo.caption,
            description: articleInfo.description,
            type: "article",
            url: articleUrl,
            images: coverUrl
                ? [
                    {
                        url: coverUrl,
                        width: 1200,
                        height: 630,
                        alt: articleInfo.caption,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: articleInfo.caption,
            description: articleInfo.description,
            images: coverUrl ? [coverUrl] : [],
        },
        alternates: {
            canonical: articleUrl,
        },
    };
}
