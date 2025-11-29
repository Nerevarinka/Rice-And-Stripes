"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState, type FC } from "react";
import { AlertTriangle } from "lucide-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import "./styles.scss";

export type ImagePosition = "left" | "center" | "right";
export type ImageSize = "small" | "medium" | "big";

export type ImageWithCaptionProps = {
    /** Изображение для отображения */
    image: StaticImageData;

    /** Подпись под изображением */
    caption: string;

    /** Alt текст для изображения */
    alt: string;

    /** Позиционирование изображения */
    position?: ImagePosition;

    /** Размер изображения */
    size?: ImageSize;

    /** Дополнительный класс для контейнера */
    className?: string;

    /** Ссылка на источник изображения */
    source?: string;

    /** Текст предупреждения для спойлера (если задан, изображение будет скрыто) */
    spoiler?: string;

    /** Возможность открыть изображение на весь экран */
    expandable?: boolean;
};

/**
 * Компонент для отображения изображения с подписью
 */
const ImageWithCaption: FC<ImageWithCaptionProps> = ({
    image,
    caption,
    alt,
    position = "center",
    size = "small",
    className,
    source,
    spoiler,
    expandable = true,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSpoilerVisible, setIsSpoilerVisible] = useState(!!spoiler);
    const isMobile = useIsMobile();

    const containerClassName = [
        "image-with-caption",
        `image-with-caption--${position}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const imageClassName = [
        "image-with-caption__image",
        `image-with-caption__image--${size}`,
    ].join(" ");

    const wrapperClassName = [
        "image-with-caption__image-wrapper",
        `image-with-caption__image-wrapper--${size}`,
        !expandable && "image-with-caption__image-wrapper--not-expandable",
    ].filter(Boolean).join(" ");

    const handleImageClick = () => {
        if (!isSpoilerVisible && expandable) {
            if (isMobile) {
                // On mobile, open image in new tab
                window.open(image.src, "_blank");
            } else {
                // On desktop, open modal
                setIsModalOpen(true);
            }
        }
    };

    const handleSpoilerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSpoilerVisible(false);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isModalOpen) {
                handleCloseModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener("keydown", handleEscKey);
            // Prevent scrolling when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
            // Restore scrolling when modal is closed
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    return (
        <>
            <div className={containerClassName}>
                <div className={wrapperClassName}>
                    <Image
                        src={image}
                        className={imageClassName}
                        alt={alt}
                        onClick={handleImageClick}
                        title={isSpoilerVisible ? undefined : (expandable ? "Кликните для увеличения" : undefined)}
                    />
                    {isSpoilerVisible && (
                        <div className="image-with-caption__spoiler" onClick={handleSpoilerClick}>
                            <div className="image-with-caption__spoiler-noise"></div>
                            <div className="image-with-caption__spoiler-content">
                                <div className="image-with-caption__spoiler-warning">
                                    <AlertTriangle size={48} />
                                </div>
                                <div className="image-with-caption__spoiler-text">{spoiler}</div>
                                <div className="image-with-caption__spoiler-button">Нажмите для просмотра</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="image-with-caption__caption">
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

            {isModalOpen && expandable && (
                <div className="image-modal" onClick={handleCloseModal}>
                    <div className="image-modal__content">
                        <Image
                            src={image}
                            className="image-modal__image"
                            alt={alt}
                            fill
                            style={{ objectFit: "contain" }}
                        />
                        {caption && (
                            <div className="image-modal__caption">{caption}</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageWithCaption;
