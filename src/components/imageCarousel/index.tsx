"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useState, useEffect, type FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import "./styles.scss";

export type CarouselImage = {
    /** Источник изображения (строка URL) */
    src?: string;

    /** Изображение (StaticImageData) */
    image?: StaticImageData;

    /** Подпись к изображению */
    caption?: string;

    /** Alt текст для изображения */
    alt?: string;

    /** Ссылка на источник */
    source?: string;
};

export type ImageCarouselProps = {
    /** Массив изображений для отображения */
    images: CarouselImage[];
};

/**
 * Компонент карусели изображений с возможностью увеличения
 */
const ImageCarousel: FC<ImageCarouselProps> = ({
    images,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isMobile = useIsMobile();
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const currentImage = images[currentIndex];
    const currentSrc = currentImage.image || currentImage.src;
    const currentAlt = currentImage.alt;
    const currentCaption = currentImage.caption;
    const currentSource = currentImage.source;

    const goToPrevious = useCallback(() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)), [images.length]);
    const goToNext = useCallback(() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)), [images.length]);
    const openModal = useCallback(() => {
        if (isMobile) {
            // On mobile, open current image in new tab
            const src = currentImage.image?.src || currentImage.src;
            if (src) {
                window.open(src, "_blank");
            }
        } else {
            setIsModalOpen(true);
        }
    }, [isMobile, currentImage]);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    const handleModalPrevious = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        goToPrevious();
    }, [goToPrevious]);

    const handleModalNext = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        goToNext();
    }, [goToNext]);

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;

            if (e.key === "Escape") {
                closeModal();
            } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A" || e.key === "ф" || e.key === "Ф") {
                goToPrevious();
            } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D" || e.key === "в" || e.key === "В") {
                goToNext();
            }
        };

        if (isModalOpen) {
            document.addEventListener("keydown", handleKeyDown);
            // Prevent scrolling when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            // Restore scrolling when modal is closed
            document.body.style.overflow = "";
        };
    }, [isModalOpen, closeModal, goToPrevious, goToNext]);

    if (images.length === 0) {
        return null;
    }

    return (
        <>
            <div className="image-carousel">
                <div className="image-carousel__content">
                    <div
                        className="image-carousel__image-wrapper"
                        onTouchStart={isMobile ? onTouchStart : undefined}
                        onTouchMove={isMobile ? onTouchMove : undefined}
                        onTouchEnd={isMobile ? onTouchEnd : undefined}
                    >
                        <Image
                            src={currentSrc!}
                            className="image-carousel__image"
                            alt={`${currentAlt} ${currentIndex + 1}`}
                            onClick={openModal}
                            title="Кликните для увеличения"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    className="image-carousel__button image-carousel__button--prev"
                                    onClick={goToPrevious}
                                    aria-label="Предыдущее изображение"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    className="image-carousel__button image-carousel__button--next"
                                    onClick={goToNext}
                                    aria-label="Следующее изображение"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="image-carousel__dots">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`image-carousel__dot ${index === currentIndex ? "image-carousel__dot--active" : ""
                                        }`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Перейти к изображению ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                {currentCaption && (
                    <div className="image-carousel__caption">
                        {currentCaption}
                        {currentSource && (
                            <>
                                <br />
                                <a href={currentSource} target="_blank" rel="noopener noreferrer" className="source-link">
                                    Источник
                                </a>
                            </>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="image-modal" onClick={closeModal}>
                    <div className="image-modal__content">
                        <Image
                            src={currentSrc!}
                            className="image-modal__image"
                            alt={currentAlt ?? currentCaption ?? ""}
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    {images.length > 1 && (
                        <>
                            <button
                                className="image-modal__button image-modal__button--prev"
                                onClick={handleModalPrevious}
                                aria-label="Предыдущее изображение"
                            >
                                <ChevronLeft size={48} />
                            </button>
                            <button
                                className="image-modal__button image-modal__button--next"
                                onClick={handleModalNext}
                                aria-label="Следующее изображение"
                            >
                                <ChevronRight size={48} />
                            </button>
                            <div className="image-modal__counter">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                    {currentCaption && (
                        <div className="image-modal__caption">
                            {currentCaption}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ImageCarousel;
