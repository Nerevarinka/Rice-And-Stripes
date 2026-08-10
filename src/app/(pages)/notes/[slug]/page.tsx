import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@bodynarf/utils/date/format";

import ArticleRenderer from "@/components/articleRenderer";
import { createArticleMetadata } from "@/shared/metadata";
import { getEditableNoteBySlug, getEditableNotes } from "@/shared/editableNotes";

import "../styles.scss";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
    const notes = await getEditableNotes();
    return notes.length
        ? notes.map(note => ({ slug: note.slug }))
        : [{ slug: "_empty" }];
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    if (slug === "_empty") return {};
    const note = await getEditableNoteBySlug(slug);
    if (!note) return {};

    return createArticleMetadata({
        caption: note.title,
        link: `/notes/${note.slug}`,
        cover: note.coverUrl,
        description: note.description,
        publishDate: new Date(note.publishDate),
        tags: [],
    }, [note.title, note.description]);
}

export default async function EditableNotePage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    if (slug === "_empty") return null;
    const note = await getEditableNoteBySlug(slug);
    if (!note) notFound();
    const publishDate = new Date(note.publishDate);
    const updatedDate = new Date(note.updatedAt);
    const wasUpdated = formatDate(publishDate, "yyyy-MM-dd") !== formatDate(updatedDate, "yyyy-MM-dd");

    return (
        <main className="note-detail">
            <article className="note-detail__content content">
                <h1 className="title is-2">{note.title}</h1>
                <div className="note-detail__meta">
                    <time dateTime={note.publishDate} title="Дата первой публикации">
                        Опубликовано: {formatDate(publishDate, "dd.MM.yyyy")}
                    </time>
                    {wasUpdated ? (
                        <time dateTime={note.updatedAt} title="Дата последнего редактирования">
                            Обновлено: {formatDate(updatedDate, "dd.MM.yyyy")}
                        </time>
                    ) : null}
                </div>
                <div className="note-detail__body">
                    {note.blocks?.length ? (
                        <ArticleRenderer blocks={note.blocks} />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: note.html }} />
                    )}
                </div>
            </article>
        </main>
    );
}
