import { formatDate } from "@bodynarf/utils/date/format";
import { ArrowLeft, Clock3 } from "lucide-react";
import Link from "next/link";

import ShareButton from "@/components/shareButton";
import { formatReadingTime } from "@/shared/utils/readingTime";

import "./styles.scss";

type PublicationHeaderProps = {
    kind: "article" | "note";
    title: string;
    description?: string;
    publishDate: string;
    updatedAt: string;
    readingTimeMinutes?: number;
};

const publicationLabels = {
    article: {
        backHref: "/articles",
        backLabel: "К статьям",
        backAriaLabel: "Вернуться к статьям",
    },
    note: {
        backHref: "/notes",
        backLabel: "К заметкам",
        backAriaLabel: "Вернуться к заметкам",
    },
} as const;

export default function PublicationHeader({
    kind,
    title,
    description,
    publishDate,
    updatedAt,
    readingTimeMinutes,
}: PublicationHeaderProps) {
    const labels = publicationLabels[kind];
    const published = new Date(publishDate);
    const updated = new Date(updatedAt);
    const wasUpdated = formatDate(published, "yyyy-MM-dd") !== formatDate(updated, "yyyy-MM-dd");

    return (
        <header className={`publication-header publication-header--${kind}`}>
            <Link
                href={labels.backHref}
                className="button is-light publication-header__back"
                aria-label={labels.backAriaLabel}
            >
                <ArrowLeft size={15} aria-hidden="true" />
                <span>{labels.backLabel}</span>
            </Link>
            <div className="publication-header__title-row">
                <h1 className="title is-2 publication-header__title">
                    {title}{" "}<ShareButton title={title} text={description} />
                </h1>
            </div>
            <div className="publication-header__meta">
                <span className="publication-header__primary">
                    {readingTimeMinutes != null ? (
                        <span className="publication-header__reading-time" title="Ориентировочное время чтения">
                            <Clock3 size={17} aria-hidden="true" />
                            {formatReadingTime(readingTimeMinutes)}
                        </span>
                    ) : null}
                </span>
                <span className="publication-header__dates">
                    <time dateTime={publishDate} title="Дата первой публикации">
                        Опубликовано: {formatDate(published, "dd.MM.yyyy")}
                    </time>
                    {wasUpdated ? (
                        <time dateTime={updatedAt} title="Дата последнего редактирования">
                            Обновлено: {formatDate(updated, "dd.MM.yyyy")}
                        </time>
                    ) : null}
                </span>
            </div>
        </header>
    );
}
