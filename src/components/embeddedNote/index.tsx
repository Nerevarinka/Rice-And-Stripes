import Link from "next/link";
import { CalendarDays, FileText, MoveUpRight } from "lucide-react";

import type { EmbeddedNoteSummary } from "@/models";
import { normalizeEditableArticleAssetUrl } from "@/shared/editableArticles";

import "./styles.scss";

function formatDate(value: string) {
    const [year, month, day] = value.slice(0, 10).split("-");
    return `${day}.${month}.${year}`;
}

export default function EmbeddedNote({ note }: { note: EmbeddedNoteSummary }) {
    return (
        <aside className="embedded-note" aria-label={`Встроенная заметка: ${note.title}`}>
            <div className="embedded-note__header">
                <span className="embedded-note__kind"><FileText size={16} aria-hidden="true" /> Заметка</span>
                <time dateTime={note.publishDate}><CalendarDays size={15} aria-hidden="true" /> {formatDate(note.publishDate)}</time>
            </div>
            <div className="embedded-note__content">
                <div className="embedded-note__text">
                    <h3>{note.title}</h3>
                    {note.description ? <p>{note.description}</p> : null}
                    <Link href={`/notes/${note.slug}`} className="embedded-note__link">
                        <span>Открыть заметку</span>
                        <MoveUpRight size={16} aria-hidden="true" />
                    </Link>
                </div>
                {note.coverUrl ? (
                    <img
                        className="embedded-note__cover"
                        src={normalizeEditableArticleAssetUrl(note.coverUrl)}
                        alt=""
                    />
                ) : null}
            </div>
        </aside>
    );
}
