"use client";

import { useMemo, useState, type FC } from "react";
import { AlertTriangle } from "lucide-react";

import "./styles.scss";
import { ASSETS_PREFIX } from "../../../next.config";
import { generateAssetPath } from "@/shared/utils/assetPathBuilder";

export type VideoPosition = "left" | "center" | "right";
export type VideoSize = "small" | "medium" | "big";

export type VideoWithCaptionProps = {
    /** Путь к видеофайлу */
    src: string;

    /** Подпись под видео */
    caption: string;

    /** Позиционирование видео */
    position?: VideoPosition;

    /** Размер видео */
    size?: VideoSize;

    /** Дополнительный класс для контейнера */
    className?: string;

    /** Ссылка на источник видео */
    source?: string;

    /** Текст предупреждения для спойлера (если задан, видео будет скрыто) */
    spoiler?: string;

    /** MIME тип видео (по умолчанию video/mp4) */
    type?: string;
};

/**
 * Компонент для отображения видео с подписью
 */
const VideoWithCaption: FC<VideoWithCaptionProps> = ({
    src,
    caption,
    position = "center",
    size = "medium",
    className,
    source,
    spoiler,
    type = "video/mp4",
}) => {
    const [isSpoilerVisible, setIsSpoilerVisible] = useState(!!spoiler);

    const containerClassName = [
        "video-with-caption",
        `video-with-caption--${position}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const videoClassName = [
        "video-with-caption__video",
        `video-with-caption__video--${size}`,
    ].join(" ");

    const wrapperClassName = [
        "video-with-caption__video-wrapper",
        `video-with-caption__video-wrapper--${size}`,
    ].join(" ");

    const handleSpoilerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSpoilerVisible(false);
    };

    const pathToVideo = useMemo(
        () => generateAssetPath(src),
        [src]
    );

    return (
        <div className={containerClassName}>
            <div className={wrapperClassName}>
                <video
                    className={videoClassName}
                    controls
                >
                    <source src={pathToVideo} type={type} />
                    Браузер не поддерживает HTML5 видео
                </video>
                {isSpoilerVisible && (
                    <div className="video-with-caption__spoiler" onClick={handleSpoilerClick}>
                        <div className="video-with-caption__spoiler-noise"></div>
                        <div className="video-with-caption__spoiler-content">
                            <div className="video-with-caption__spoiler-warning">
                                <AlertTriangle size={48} />
                            </div>
                            <div className="video-with-caption__spoiler-text">{spoiler}</div>
                            <div className="video-with-caption__spoiler-button">Нажмите для просмотра</div>   
                        </div>
                    </div>
                )}
            </div>
            <div className="video-with-caption__caption">
                {caption}
                {source && (
                    <>
                        <br />
                        <a href={source} target="_blank" rel="noopener noreferrer" className="source-link">   
                            Источник
                        </a>
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoWithCaption;
