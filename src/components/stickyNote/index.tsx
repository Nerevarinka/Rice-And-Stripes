import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@bodynarf/utils/date/format";

import { Note, MediaItemTag } from "@/models";
import TagComponent from "@/components/tag";

import "./styles.scss";

interface StickyNoteProps {
    /** Заметка для отображения */
    note: Note;

    /** Обработчик клика по тегу */
    onTagClick?: (tag: MediaItemTag, e: React.MouseEvent) => void;

    /** Позиция карточки, используемая для чередования бумажного декора */
    decorationIndex?: number;
}

/**
 * Компонент для отображения заметки в виде sticky-note
 */
const StickyNote: React.FC<StickyNoteProps> = ({
    note,
    onTagClick,
    decorationIndex = 0,
}) => {
    const getDecorationClass = () => {
        const decorations = [
            "clip-left-green",
            "tape-yellow",
            "clip-right-silver",
            "perforated",
            "clip-left-gold",
            "tape-gray",
            "clip-right-blue",
            "plain",
        ];
        return decorations[decorationIndex % decorations.length];
    };

    const decorationClass = getDecorationClass();
    const imageAlt = note.imageAlt || note.caption || "";

    return (
        <div className="sticky-note-wrapper">
            <Link href={note.link}>
                <article className={`sticky-note sticky-note--${decorationClass}`}>
                    {decorationClass === "perforated" ? (
                        <div className="sticky-note-perforation" aria-hidden="true" />
                    ) : null}
                    <span className="sticky-note-page-turn" aria-hidden="true" />
                    {note.caption && (
                        <h3 className="sticky-note-title">{note.caption}</h3>
                    )}
                    {note.image ? (
                        <div className="sticky-note-image">
                            {typeof note.image === "string" ? (
                                <img src={note.image} alt={imageAlt} />
                            ) : (
                                <Image src={note.image} alt={imageAlt} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                            )}
                        </div>
                    ) : null}
                    <div className="sticky-note-content">
                        <p className="sticky-note-description">
                            {note.description}
                        </p>
                    </div>
                    <div className="sticky-note-footer">
                        <time
                            className="sticky-note-date"
                            title="Дата публикации заметки"
                        >
                            {formatDate(note.publishDate, "dd.MM.yyyy")}
                        </time>
                        <div className="sticky-note-tags">
                            {note.tags.map(tag => (
                                <TagComponent
                                    key={tag}
                                    tag={tag}
                                    onClick={onTagClick}
                                />
                            ))}
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
};

export default StickyNote;
