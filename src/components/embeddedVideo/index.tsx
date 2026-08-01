"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

type EmbeddedVideoProps = {
    src: string;
    caption: string;
    source?: string;
    title?: string;
    size: "small" | "medium" | "big";
    spoiler?: string;
};

export default function EmbeddedVideo({
    src,
    caption,
    source,
    title,
    size,
    spoiler,
}: EmbeddedVideoProps) {
    const [isSpoilerVisible, setIsSpoilerVisible] = useState(Boolean(spoiler));

    return (
        <div className={`embedded-video embedded-video--${size}`}>
            <div className={`video-with-caption__video-wrapper video-with-caption__video-wrapper--${size}`}>
                <iframe
                    src={src}
                    title={title ?? caption ?? "Видео"}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
                {isSpoilerVisible ? (
                    <button
                        type="button"
                        className="video-with-caption__spoiler"
                        onClick={() => setIsSpoilerVisible(false)}
                    >
                        <span className="video-with-caption__spoiler-content">
                            <span className="video-with-caption__spoiler-warning"><AlertTriangle size={48} /></span>
                            <span className="video-with-caption__spoiler-text">{spoiler}</span>
                            <span className="video-with-caption__spoiler-button">Нажмите для просмотра</span>
                        </span>
                    </button>
                ) : null}
            </div>
            <div className="video-with-caption__caption">
                {caption}
                {source ? (
                    <>
                        {caption ? <br /> : null}
                        <a href={source} target="_blank" rel="noopener noreferrer" className="source-link">
                            Оригинал
                        </a>
                    </>
                ) : null}
            </div>
        </div>
    );
}
