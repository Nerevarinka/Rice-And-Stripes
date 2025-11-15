"use client";

import { useEffect, useState, type FC, type ReactNode } from "react";

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

    const scrollToElement = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const containerClassName = ["content-with-toc", "mr-4", className]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={containerClassName}>
            <div className="content-with-toc__content">
                {children}
            </div>

            <nav className="table-of-contents">
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
