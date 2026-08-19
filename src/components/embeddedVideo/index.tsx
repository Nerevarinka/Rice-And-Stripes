"use client";

import { useState, type ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";
import MediaCaption from "@/components/mediaCaption";

import "../videoWithCaption/styles.scss";

type EmbeddedVideoProps = {
    src: string;
    caption: ReactNode;
    source?: string;
    title?: string;
    size: "small" | "medium" | "big";
    spoiler?: string;
    troubleshooting?: {
        provider: "VK" | "RUTUBE";
        originalUrl: string;
    };
};

export default function EmbeddedVideo({
    src,
    caption,
    source,
    title,
    size,
    spoiler,
    troubleshooting,
}: EmbeddedVideoProps) {
    const [isSpoilerVisible, setIsSpoilerVisible] = useState(Boolean(spoiler));

    return (
        <div className={`embedded-video embedded-video--${size}`}>
            <div className={`video-with-caption__video-wrapper video-with-caption__video-wrapper--${size}`}>
                <iframe
                    src={src}
                    title={title ?? "Видео"}
                    loading="eager"
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
            <MediaCaption
                className="video-with-caption__caption"
                caption={caption}
                source={source}
                sourceLabel="Оригинал"
                secondary={troubleshooting ? (
                        <span
                            className="embedded-video__troubleshooting"
                            tabIndex={0}
                            aria-label="Подсказка, если видео не загрузилось"
                        >
                            <span className="embedded-video__help-label">Не загрузилось?</span>
                            <Info size={12} aria-hidden="true" />
                            <span className="embedded-video__help-tooltip" role="tooltip">
                                Загрузка с {troubleshooting.provider} иногда задерживается. Если видео долго не появляется,
                                обновите страницу, проверьте VPN или блокировщик либо {" "}
                                <a href={troubleshooting.originalUrl} target="_blank" rel="noopener noreferrer">
                                    откройте его на {troubleshooting.provider}
                                </a>.
                            </span>
                        </span>
                ) : undefined}
            />
        </div>
    );
}
