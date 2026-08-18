import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3 } from "lucide-react";
import { formatDate } from "@bodynarf/utils/date/format";

import TableOfContents from "@/components/tableOfContents";
import ArticleNavigation from "@/components/articleNavigation";
import ArticleRenderer from "@/components/articleRenderer";
import JsonLd from "@/components/jsonLd";
import { createArticleMetadata } from "@/shared/metadata";
import { createPublicationStructuredData } from "@/shared/structuredData";
import { getEditableArticles, getEditableArticleBySlug } from "@/shared/editableArticles";
import { editableNoteToEmbedSummary, getEditableNotes } from "@/shared/editableNotes";
import { extractTocItemsFromHtml } from "@/shared/utils/extractTocItemsFromHtml";
import { getEditableArticleNavigation } from "@/shared/utils/editableArticleNavigation";
import { calculateReadingTimeMinutes, formatReadingTime } from "@/shared/utils/readingTime";

export async function generateStaticParams() {
    const articles = await getEditableArticles();

    return articles.map(article => ({ slug: article.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
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
        : extractTocItemsFromHtml(article.html ?? "");
    const readingTimeMinutes = article.readingTimeMinutes
        ?? calculateReadingTimeMinutes(article.blocks ?? []);
    const publishDate = new Date(article.publishDate);
    const updatedDate = new Date(article.updatedAt);
    const wasUpdated = formatDate(publishDate, "yyyy-MM-dd") !== formatDate(updatedDate, "yyyy-MM-dd");

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
            <div className="article-content-wrapper">
                <div className="article-content content">
                    <h1 className="title is-2">{article.title}</h1>
                    <div className="article-meta article-meta--lead">
                        <span className="article-reading-time" title="Ориентировочное время чтения">
                            <Clock3 size={17} />
                            {formatReadingTime(readingTimeMinutes)}
                        </span>
                        <span className="article-date-group">
                            <time dateTime={article.publishDate} title="Дата первой публикации">
                                Опубликовано: {formatDate(publishDate, "dd.MM.yyyy")}
                            </time>
                            {wasUpdated ? (
                                <time dateTime={article.updatedAt} title="Дата последнего редактирования">
                                    Обновлено: {formatDate(updatedDate, "dd.MM.yyyy")}
                                </time>
                            ) : null}
                        </span>
                    </div>
                    {article.blocks?.length ? (
                        <ArticleRenderer blocks={article.blocks} embeddedNotes={embeddedNotes} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: article.html }} />
                    )}
                </div>
                <ArticleNavigation {...navigation} />
            </div>
        </TableOfContents>
    );
}
