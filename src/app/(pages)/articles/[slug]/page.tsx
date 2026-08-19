import type { Metadata } from "next";
import { notFound } from "next/navigation";

import TableOfContents from "@/components/tableOfContents";
import PublicationNavigation from "@/components/publicationNavigation";
import ArticleRenderer from "@/components/articleRenderer";
import JsonLd from "@/components/jsonLd";
import PublicationHeader from "@/components/publicationHeader";
import LegacyArticleRedirect from "@/components/legacyArticleRedirect";
import { createArticleMetadata } from "@/shared/metadata";
import { createPublicationStructuredData } from "@/shared/structuredData";
import { getEditableArticles, getEditableArticleBySlug } from "@/shared/editableArticles";
import { editableNoteToEmbedSummary, getEditableNotes } from "@/shared/editableNotes";
import { createTocItemsFromBlocks } from "@/shared/utils/extractTocItemsFromHtml";
import { getEditableArticleNavigation } from "@/shared/utils/editableArticleNavigation";
import { calculateReadingTimeMinutes } from "@/shared/utils/readingTime";
import { getLegacyArticleRedirect, legacyArticleSlugs } from "@/shared/legacyArticleRedirects";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
    const articles = await getEditableArticles();

    return Array.from(new Set([
        ...articles.map(article => article.slug),
        ...legacyArticleSlugs,
    ])).map(slug => ({ slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const redirectTo = getLegacyArticleRedirect(slug);

    if (redirectTo) {
        return {
            alternates: { canonical: redirectTo },
            robots: { index: false, follow: true },
        };
    }
    const article = await getEditableArticleBySlug(slug);

    if (!article) {
        return {};
    }

    return createArticleMetadata(
        {
            caption: article.title,
            link: `/articles/${article.slug}`,
            cover: article.coverUrl,
            description: article.description,
            publishDate: new Date(article.publishDate),
            tags: article.tags,
        },
        [article.title, article.description, ...article.tags]
    );
}

export default async function EditableArticlePage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const redirectTo = getLegacyArticleRedirect(slug);

    if (redirectTo) {
        return <LegacyArticleRedirect href={redirectTo} />;
    }
    const article = await getEditableArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const [navigation, embeddedNotes] = await Promise.all([
        getEditableArticleNavigation(`/articles/${article.slug}`),
        getEditableNotes().then(notes => notes.map(editableNoteToEmbedSummary)),
    ]);
    const tocItems = article.tocItems?.length
        ? article.tocItems
        : createTocItemsFromBlocks(article.blocks);
    const readingTimeMinutes = article.readingTimeMinutes
        ?? calculateReadingTimeMinutes(article.blocks ?? []);
    return (
        <TableOfContents items={tocItems}>
            <JsonLd data={createPublicationStructuredData({
                title: article.title,
                description: article.description,
                slug: article.slug,
                section: "articles",
                coverUrl: article.coverUrl,
                publishDate: article.publishDate,
                updatedAt: article.updatedAt,
                tags: article.tags,
            })} />
            <div className="article-content-wrapper publication-page">
                <div className="article-content publication-content content">
                    <PublicationHeader
                        kind="article"
                        title={article.title}
                        description={article.description}
                        publishDate={article.publishDate}
                        updatedAt={article.updatedAt}
                        readingTimeMinutes={readingTimeMinutes}
                    />
                    <ArticleRenderer blocks={article.blocks} embeddedNotes={embeddedNotes} />
                </div>
                <PublicationNavigation {...navigation} />
            </div>
        </TableOfContents>
    );
}
