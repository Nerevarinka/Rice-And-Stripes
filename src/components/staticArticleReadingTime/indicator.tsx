"use client";

import { Clock3 } from "lucide-react";
import { formatDate } from "@bodynarf/utils/date/format";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { formatReadingTime } from "@/shared/utils/readingTime";

export default function StaticArticleReadingTimeIndicator({
    minutes,
    publishDate,
}: {
    minutes: number;
    publishDate: string;
}) {
    const [host, setHost] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const title = document.querySelector(".article-content > .title:first-of-type");
        if (!title) {
            return;
        }

        const portalHost = document.createElement("div");
        portalHost.className = "article-reading-time-host";
        title.insertAdjacentElement("afterend", portalHost);
        const frameId = window.requestAnimationFrame(() => setHost(portalHost));

        return () => {
            window.cancelAnimationFrame(frameId);
            portalHost.remove();
        };
    }, []);

    if (!host) {
        return null;
    }

    return createPortal(
        <div className="article-meta article-meta--lead">
            <span className="article-reading-time" title="Ориентировочное время чтения">
                <Clock3 size={17} />
                {formatReadingTime(minutes)}
            </span>
            <time title="Дата первой публикации">
                {formatDate(new Date(publishDate), "dd.MM.yyyy")}
            </time>
        </div>,
        host,
        "static-article-reading-time"
    );
}
