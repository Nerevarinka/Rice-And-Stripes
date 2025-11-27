import Link from "next/link";
import { formatDate } from "@bodynarf/utils";

import { Note, MediaItemTag } from "@/models";
import TagComponent from "@/components/tag";

import "./styles.scss";

interface StickyNoteProps {
    /** Заметка для отображения */
    note: Note;

    /** Обработчик клика по тегу */
    onTagClick?: (tag: MediaItemTag, e: React.MouseEvent) => void;
}

/**
 * Компонент для отображения заметки в виде sticky-note
 */
const StickyNote: React.FC<StickyNoteProps> = ({
    note,
    onTagClick
}) => {
    const getColorClass = () => {
        const colors = ["yellow", "pink", "blue", "green", "purple", "orange"];
        const hash = note.link.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        return colors[hash % colors.length];
    };

    return (
        <div className="sticky-note-wrapper">
            <Link href={note.link}>
                <div className={`sticky-note sticky-note--${getColorClass()}`}>
                    <div className="sticky-note-content">
                        {note.caption && (
                            <h3 className="sticky-note-title">{note.caption}</h3>
                        )}
                        <p className="sticky-note-description">
                            {note.description.length > 50
                                ? `${note.description.substring(0, 50)}..`
                                : note.description
                            }
                        </p>
                    </div>
                    <div className="sticky-note-footer">
                        <div className="sticky-note-tags">
                            {note.tags.map(tag => (
                                <TagComponent
                                    key={tag}
                                    tag={tag}
                                    onClick={onTagClick}
                                />
                            ))}
                        </div>
                        <time
                            className="sticky-note-date"
                            title="Дата публикации заметки"
                        >
                            {formatDate(note.publishDate, "dd.MM.yyyy")}
                        </time>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default StickyNote;
