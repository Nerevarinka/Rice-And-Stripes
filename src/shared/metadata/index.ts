import { Metadata } from "next";

import { Article } from "@/models";
import packageJson from "../../../package.json";
import { absoluteSiteUrl, siteConfig } from "@/shared/siteConfig";

export const DEFAULT_SOCIAL_IMAGE = {
    url: absoluteSiteUrl(siteConfig.socialImage),
    width: 600,
    height: 600,
    type: "image/jpeg",
    alt: "Логотип Rice & Stripes",
} as const;

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
        title,
        description,
        type: "website",
        images: [DEFAULT_SOCIAL_IMAGE],
    },
    twitter: {
        card: "summary",
        title,
        description,
        images: [DEFAULT_SOCIAL_IMAGE.url],
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
            ? articleInfo.cover.trim()
                ? absoluteSiteUrl(articleInfo.cover)
                : DEFAULT_SOCIAL_IMAGE.url
        : "src" in articleInfo.cover
            ? articleInfo.cover.src
            : articleInfo.cover.default.src;
    const hasCover = typeof articleInfo.cover !== "string" || Boolean(articleInfo.cover.trim());

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
            images: [
                    {
                        url: coverUrl,
                        width: hasCover ? 1200 : DEFAULT_SOCIAL_IMAGE.width,
                        height: hasCover ? 630 : DEFAULT_SOCIAL_IMAGE.height,
                        alt: articleInfo.caption,
                    },
                ],
        },
        twitter: {
            card: "summary_large_image",
            title: articleInfo.caption,
            description: articleInfo.description,
            images: [coverUrl],
        },
        alternates: {
            canonical: articleUrl,
        },
    };
}
