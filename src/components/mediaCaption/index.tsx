import type { ReactNode } from "react";

import { normalizeExternalUrl } from "@/shared/utils/normalizeExternalUrl";

import "./styles.scss";

type MediaCaptionProps = {
    caption?: ReactNode;
    source?: string;
    sourceLabel?: string;
    secondary?: ReactNode;
    className?: string;
};

export default function MediaCaption({
    caption,
    source,
    sourceLabel = "Источник",
    secondary,
    className,
}: MediaCaptionProps) {
    if (!caption && !source && !secondary) return null;

    return (
        <div className={["media-caption", className].filter(Boolean).join(" ")}>
            {caption ? <div className="media-caption__text">{caption}</div> : null}
            {source || secondary ? (
                <div className="media-caption__meta">
                    {source ? (
                        <a
                            href={normalizeExternalUrl(source)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="source-link"
                        >
                            {sourceLabel}
                        </a>
                    ) : null}
                    {source && secondary ? <span className="media-caption__separator" aria-hidden="true">·</span> : null}
                    {secondary}
                </div>
            ) : null}
        </div>
    );
}
