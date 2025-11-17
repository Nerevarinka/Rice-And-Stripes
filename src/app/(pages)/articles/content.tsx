"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@bodynarf/utils";

import { articles } from "@/shared/articles";

import "./styles.scss";

export default function ArticlesContainer() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredArticles = useMemo(() => {
        let result = [...articles];

        // Сортировка по убыванию даты публикации
        result.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

        // Фильтрация по поисковому запросу
        if (searchQuery.length >= 2) {
            const query = searchQuery.toLowerCase();
            result = result.filter(article =>
                article.caption.toLowerCase().includes(query)
            );
        }

        return result;
    }, [searchQuery]);

    return (
        <section className="mx-4">
            <h2 className="title is-2">
                Статьи для владельцев
            </h2>

            <div className="field pb-4 mb-0 search-field">
                <div className="control">
                    <input
                        className="input"
                        type="text"
                        placeholder="Поиск по названию статьи..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="card-group py-4 pr-3 mt-2 pl-1">
                {filteredArticles.map(x =>
                    <div key={x.link} className="card-wrapper">
                        <Link href={x.link}>
                            <div className="card m-card">
                                <div className="card-image">
                                    <figure className="image is-16by9">
                                        <Image
                                            src={x.cover}
                                            alt={x.caption}
                                        />
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="content">
                                        <p className="title is-5 mb-2">
                                            {x.caption}
                                        </p>
                                        <p className="mb-3">
                                            {x.description}
                                        </p>
                                    </div>
                                    <time className="has-text-grey is-size-7 article-date">
                                        {formatDate(x.publishDate, "dd.MM.yyyy")}
                                    </time>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            {filteredArticles.length === 0 && (
                <div className="notification is-warning">
                    По вашему запросу ничего не найдено
                </div>
            )}
        </section>
    );
}
