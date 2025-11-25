"use client";

import { FC, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import Link from "next/link";

import "./styles.scss";

export type ArticleNavigationProps = {
    /** Предыдущая статья */
    previousArticle?: {
        title: string;
        link: string;
    };

    /** Следующая статья */
    nextArticle?: {
        title: string;
        link: string;
    };
};

const mainContainer = document.querySelector("main");

const ArticleNavigation: FC<ArticleNavigationProps> = ({ previousArticle, nextArticle }) => {
    const scrollToTop = useCallback(() => mainContainer!.scrollTo({ top: 0, behavior: "smooth" }), []);

    return (
        <div className="article-navigation">
            <div className="article-navigation__item">
                {previousArticle ? (
                    <Link href={previousArticle.link} className="button is-light article-navigation__button article-navigation__button--prev">
                        <span className="article-navigation__content">
                            <span className="article-navigation__label">Предыдущая статья</span>
                            <span className="article-navigation__title">{previousArticle.title}</span>
                        </span>
                    </Link>
                ) : (
                    <div className="article-navigation__placeholder" />
                )}
            </div>

            <div className="article-navigation__item article-navigation__item--center">
                <button
                    onClick={scrollToTop}
                    className="button is-light article-navigation__button article-navigation__button--top"
                    aria-label="Наверх"
                >
                    <span className="icon">
                        <ArrowUp size={20} />
                    </span>
                    <span>Наверх</span>
                </button>
            </div>

            <div className="article-navigation__item">
                {nextArticle ? (
                    <Link href={nextArticle.link} className="button is-light article-navigation__button article-navigation__button--next">
                        <span className="article-navigation__content">
                            <span className="article-navigation__label">Следующая статья</span>
                            <span className="article-navigation__title">{nextArticle.title}</span>
                        </span>
                    </Link>
                ) : (
                    <div className="article-navigation__placeholder" />
                )}
            </div>
        </div>
    );
};

export default ArticleNavigation;
