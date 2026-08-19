"use client";

import { FC, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import Link from "next/link";

import "./styles.scss";

export type PublicationNavigationProps = {
    /** Предыдущая статья */
    previousItem?: {
        title: string;
        link: string;
    };

    /** Следующая статья */
    nextItem?: {
        title: string;
        link: string;
    };
    itemName?: "статья" | "заметка";
};

const PublicationNavigation: FC<PublicationNavigationProps> = ({ previousItem, nextItem, itemName = "статья" }) => {
    const scrollToTop = useCallback(() => document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" }), []);

    return (
        <div className="publication-navigation">
            <div className="publication-navigation__item">
                {previousItem ? (
                    <Link href={previousItem.link} className="button is-light publication-navigation__button publication-navigation__button--prev">
                        <span className="publication-navigation__content">
                            <span className="publication-navigation__label">Предыдущая {itemName}</span>
                            <span className="publication-navigation__title">{previousItem.title}</span>
                        </span>
                    </Link>
                ) : (
                    <div className="publication-navigation__placeholder" />
                )}
            </div>

            <div className="publication-navigation__item publication-navigation__item--center">
                <button
                    onClick={scrollToTop}
                    className="button is-light publication-navigation__button publication-navigation__button--top"
                    aria-label="Наверх"
                >
                    <span className="icon">
                        <ArrowUp size={20} />
                    </span>
                    <span>Наверх</span>
                </button>
            </div>

            <div className="publication-navigation__item">
                {nextItem ? (
                    <Link href={nextItem.link} className="button is-light publication-navigation__button publication-navigation__button--next">
                        <span className="publication-navigation__content">
                            <span className="publication-navigation__label">Следующая {itemName}</span>
                            <span className="publication-navigation__title">{nextItem.title}</span>
                        </span>
                    </Link>
                ) : (
                    <div className="publication-navigation__placeholder" />
                )}
            </div>
        </div>
    );
};

export default PublicationNavigation;
