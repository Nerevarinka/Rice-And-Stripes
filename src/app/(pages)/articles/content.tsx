"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@bodynarf/utils";

import { articles } from "@/shared/articles";
import { MediaItemTagColors, MediaItemTag } from "@/models";
import TagComponent from "@/components/TagComponent";

import "./styles.scss";

export default function ArticlesContainer() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<MediaItemTag[]>([]);

    const availableTags = useMemo(() => {
        const tagsSet = new Set<MediaItemTag>();

        articles.forEach(article => {
            article.tags.forEach(tag => tagsSet.add(tag));
        });

        return Array.from(tagsSet);
    }, []);

    const filteredArticles = useMemo(() => {
        let result = [...articles];

        // Сортировка по убыванию даты публикации
        result.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

        // Фильтрация по тегам
        if (selectedTags.length > 0) {
            result = result.filter(article =>
                selectedTags.some(tag => article.tags.includes(tag))
            );
        }

        // Фильтрация по поисковому запросу
        if (searchQuery.length >= 2) {
            const query = searchQuery.toLowerCase();
            result = result.filter(article =>
                article.caption.toLowerCase().includes(query)
            );
        }

        return result;
    }, [searchQuery, selectedTags]);

    const handleTagClick = (tag: MediaItemTag, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <section className="mx-4">
            <h2 className="title is-2">
                Статьи для владельцев
            </h2>

            <SearchAndFilterPanel
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                availableTags={availableTags}
            />

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
                                            {x.description.length > 150 
                                                ? `${x.description.substring(0, 150)}..` 
                                                : x.description
                                            }
                                        </p>
                                    </div>
                                    <div className="article-tags mb-2">
                                        {x.tags.map(tag => (
                                            <TagComponent
                                                key={tag}
                                                tag={tag}
                                                onClick={handleTagClick}
                                            />
                                        ))}
                                    </div>
                                    <time 
                                        className="has-text-grey is-size-7 article-date"
                                        title="Дата публикации статьи"
                                    >
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

interface SearchAndFilterPanelProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedTags: MediaItemTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<MediaItemTag[]>>;
    availableTags: MediaItemTag[];
}

function SearchAndFilterPanel({
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    availableTags
}: SearchAndFilterPanelProps) {
    return (
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

            <div className="mt-3 is-flex is-align-items-center is-flex-wrap-wrap" style={{ gap: '0.75rem' }}>
                <div className="is-flex is-align-items-center">
                    <label className="label mb-0 mr-2">Фильтр по тегам:</label>
                    <div className="select">
                        <select
                            value=""
                            onChange={(e) => {
                                const tag = e.target.value as MediaItemTag;
                                if (tag && !selectedTags.includes(tag)) {
                                    setSelectedTags(prev => [...prev, tag]);
                                }
                            }}
                        >
                            <option value="">Выберите тег...</option>
                            {availableTags
                                .filter(tag => !selectedTags.includes(tag))
                                .map(tag => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {selectedTags.length > 0 && (
                    <div className="is-flex is-align-items-center is-flex-wrap-wrap" style={{ gap: '0.5rem' }}>
                        {selectedTags.map(tag => (
                            <span
                                key={tag}
                                className="tag is-medium"
                                style={{
                                    backgroundColor: MediaItemTagColors[tag].background,
                                    color: MediaItemTagColors[tag].text
                                }}
                            >
                                {tag}
                                <button
                                    className="delete is-small ml-2"
                                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                                />
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
