"use client";

import { useEffect, useState, useRef, type FC, type ReactNode } from "react";
import { List, X } from "lucide-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import "./styles.scss";

export type TableOfContentsItem = {
    /** Текст ссылки */
    caption: string;

    /** ID элемента на странице */
    elementId: string;
};

export type TableOfContentsProps = {
    /** Массив элементов содержания */
    items: TableOfContentsItem[];

    /** Контент страницы */
    children: ReactNode;

    /** Дополнительный класс для контейнера */
    className?: string;
};

/**
 * Компонент оглавления с автоматическим отслеживанием активного раздела
 */
const TableOfContents: FC<TableOfContentsProps> = ({ items, children, className }) => {
    const [activeId, setActiveId] = useState<string>("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const navRef = useRef<HTMLElement | null>(null);
    const toggleRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -35% 0px",
                threshold: 0.1,
            }
        );

        // Наблюдаем за всеми элементами из списка
        items.forEach(({ elementId }) => {
            const element = document.getElementById(elementId);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [items]);

    // Close sidebar when clicking outside (on mobile)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isMobile || !isMobileMenuOpen) return;
            const target = event.target as Node;

            // If click is inside nav or on the toggle button, do nothing
            if (navRef.current && navRef.current.contains(target)) return;
            if (toggleRef.current && toggleRef.current.contains(target)) return;

            setIsMobileMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile, isMobileMenuOpen]);

    const scrollToElement = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        // Close mobile menu after navigation
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    const containerClassName = ["content-with-toc", "mr-4", className]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={containerClassName}>
            {isMobile && (
                <button
                    ref={toggleRef}
                    className={`toc-toggle${isMobileMenuOpen ? ' is-open' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Закрыть оглавление" : "Открыть оглавление"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
                </button>
            )}
            {isMobile && isMobileMenuOpen && (
                <div
                    className="toc-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            <div className="content-with-toc__content">
                {children}
            </div>

            <nav ref={navRef} className={`table-of-contents${isMobile && isMobileMenuOpen ? ' table-of-contents--mobile-open' : ''}${isMobile ? ' table-of-contents--mobile' : ''}`}>
                <ul className="table-of-contents__list pl-2">
                    {items.map(({ caption, elementId }) => (
                        <li key={elementId} className="table-of-contents__item">
                            <a
                                onClick={() => scrollToElement(elementId)}
                                className={
                                    `table-of-contents__link ${activeId === elementId
                                        ? "table-of-contents__link--active"
                                        : ""
                                    }`}
                            >
                                {caption}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default TableOfContents;
