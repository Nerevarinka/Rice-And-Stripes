"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Clock3, Grid2X2, List, RotateCcw, SlidersHorizontal } from "lucide-react";

import { formatDate } from "@bodynarf/utils/date/format";

import type { Article, MediaItemTag } from "@/models";
import { MediaItemTagColors } from "@/models";
import TagComponent from "@/components/tag";
import SortControl, { type SortOption } from "@/components/sortControl";
import ContentPagination from "@/components/contentPagination";
import { useIsMobile } from "@/hooks/useIsMobile";

import "./styles.scss";

type ArticlesContainerProps = {
    articles: Article[];
};

type ArticlesView = "grid" | "list";
type ArticlesSort = "newest" | "oldest" | "title-asc" | "title-desc" | "shortest" | "longest";

const articleSortOptions: SortOption[] = [
    { value: "newest", label: "Сначала новые" },
    { value: "oldest", label: "Сначала старые" },
    { value: "title-asc", label: "По названию А–Я" },
    { value: "title-desc", label: "По названию Я–А" },
    { value: "shortest", label: "Сначала короткие" },
    { value: "longest", label: "Сначала длинные" },
];
const pageSizeOptions: SortOption[] = [12, 24, 48].map(value => ({
    value: String(value),
    label: String(value),
}));

export default function ArticlesContainer({ articles }: ArticlesContainerProps) {
    const [selectedTags, setSelectedTags] = useState<MediaItemTag[]>([]);
    const [view, setView] = useState<ArticlesView>("grid");
    const [sort, setSort] = useState<ArticlesSort>("newest");
    const [pageSize, setPageSize] = useState(24);
    const [currentPage, setCurrentPage] = useState(1);
    const listRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();
    const effectiveView: ArticlesView = isMobile ? "grid" : view;

    useEffect(() => {
        const savedView = window.localStorage.getItem("articles-view");
        if (savedView === "grid" || savedView === "list") setView(savedView);
        const savedSort = window.localStorage.getItem("articles-sort") as ArticlesSort | null;
        if (articleSortOptions.some(option => option.value === savedSort)) setSort(savedSort!);
        const savedPageSize = Number(window.localStorage.getItem("articles-page-size"));
        if ([12, 24, 48].includes(savedPageSize)) setPageSize(savedPageSize);
    }, []);

    const selectView = (nextView: ArticlesView) => {
        setView(nextView);
        window.localStorage.setItem("articles-view", nextView);
    };

    const selectSort = (nextSort: string) => {
        const value = nextSort as ArticlesSort;
        setSort(value);
        window.localStorage.setItem("articles-sort", value);
    };

    const selectPageSize = (nextSize: string) => {
        const value = Number(nextSize);
        setPageSize(value);
        window.localStorage.setItem("articles-page-size", String(value));
    };

    const availableTags = useMemo(() => {
        const tagsSet = new Set<MediaItemTag>();

        articles.forEach(article => {
            article.tags.forEach(tag => tagsSet.add(tag));
        });

        return Array.from(tagsSet);
    }, [articles]);

    const filteredArticles = useMemo(() => {
        let result = [...articles];

        if (selectedTags.length > 0) {
            result = result.filter(article =>
                selectedTags.some(tag => article.tags.includes(tag))
            );
        }

        result.sort((left, right) => {
            switch (sort) {
                case "oldest": return left.publishDate.getTime() - right.publishDate.getTime();
                case "title-asc": return left.caption.localeCompare(right.caption, "ru");
                case "title-desc": return right.caption.localeCompare(left.caption, "ru");
                case "shortest": return (left.readingTimeMinutes ?? 0) - (right.readingTimeMinutes ?? 0);
                case "longest": return (right.readingTimeMinutes ?? 0) - (left.readingTimeMinutes ?? 0);
                default: return right.publishDate.getTime() - left.publishDate.getTime();
            }
        });

        return result;
    }, [articles, selectedTags, sort]);

    useEffect(() => setCurrentPage(1), [selectedTags, sort, pageSize]);

    const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
    const pagedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const changePage = (page: number) => {
        setCurrentPage(page);
        requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };

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
        <section className="mx-4 is-h-100">
            <div className="articles-header mb-4">
                <h2 className={`title ${isMobile ? "is-3" : "is-2"}`}>
                    Статьи для владельцев
                </h2>
            </div>

            <TagFilterPanel
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                availableTags={availableTags}
                sort={sort}
                onSortChange={selectSort}
                view={view}
                onViewChange={selectView}
                showViewToggle={!isMobile}
                pageSize={pageSize}
                onPageSizeChange={selectPageSize}
            />

            <div ref={listRef} className={`card-group card-group--${effectiveView} py-4 pr-3 mt-2 mb-4 pl-1`}>
                {pagedArticles.map(x =>
                    <div key={x.link} className="card-wrapper">
                        <Link href={x.link}>
                            <div className="card m-card">
                                <div className="card-image">
                                    <figure className={`image ${effectiveView === "list" ? "article-list-image" : "is-16by9"}`}>
                                        {x.cover ? (
                                            <Image
                                                src={x.cover}
                                                alt={x.caption}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                style={{ objectFit: effectiveView === "list" ? "contain" : "cover" }}
                                            />
                                        ) : (
                                            <div
                                                className="has-background-light"
                                                style={{ width: "100%", height: "100%" }}
                                            />
                                        )}
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
                                    <div className="article-card-meta has-text-grey is-size-7">
                                        {x.readingTimeMinutes ? (
                                            <span className="article-reading-time" title="Ориентировочное время чтения">
                                                <Clock3 size={14} />
                                                Время на прочтение: {x.readingTimeMinutes} мин
                                            </span>
                                        ) : null}
                                        <time className="article-date" title="Дата публикации статьи">
                                            {formatDate(x.publishDate, "dd.MM.yyyy")}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            <ContentPagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />

            {filteredArticles.length === 0 && (
                <div className="notification is-warning">
                    По вашему запросу ничего не найдено
                </div>
            )}
        </section>
    );
}

interface TagFilterPanelProps {
    selectedTags: MediaItemTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<MediaItemTag[]>>;
    availableTags: MediaItemTag[];
    sort: ArticlesSort;
    onSortChange: (sort: string) => void;
    view: ArticlesView;
    onViewChange: (view: ArticlesView) => void;
    showViewToggle: boolean;
    pageSize: number;
    onPageSizeChange: (pageSize: string) => void;
}

function TagFilterPanel({
    selectedTags,
    setSelectedTags,
    availableTags,
    sort,
    onSortChange,
    view,
    onViewChange,
    showViewToggle,
    pageSize,
    onPageSizeChange,
}: TagFilterPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag));

    useEffect(() => {
        const closeDropdown = (event: PointerEvent) => {
            if (!dropdownRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("pointerdown", closeDropdown);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeDropdown);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    return (
        <div className="field pb-4 mb-0 search-field">
            <button
                type="button"
                className="articles-tools-toggle"
                onClick={() => setIsMobilePanelOpen(current => !current)}
                aria-expanded={isMobilePanelOpen}
            >
                <SlidersHorizontal size={18} aria-hidden="true" />
                <span>Фильтры и сортировка</span>
                <ChevronDown size={18} aria-hidden="true" />
            </button>
            <div className={`articles-tools${isMobilePanelOpen ? " is-mobile-open" : ""}`}>
                <div className="articles-tools__filter">
                    <div className="articles-tools__filter-row">
                        <label className="label mb-0">Фильтр по тегам:</label>
                        <div ref={dropdownRef} className={`tag-filter-select${isOpen ? " is-open" : ""}`}>
                        <button
                            type="button"
                            className="tag-filter-select__trigger"
                            onClick={() => setIsOpen(current => !current)}
                            aria-haspopup="listbox"
                            aria-expanded={isOpen}
                        >
                            <span>Выберите тег...</span>
                            <ChevronDown size={18} aria-hidden="true" />
                        </button>
                        {isOpen ? (
                            <div className="tag-filter-select__menu" role="listbox" aria-label="Теги статей">
                                {unselectedTags.length ? unselectedTags.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className="tag-filter-select__option"
                                        role="option"
                                        aria-selected="false"
                                        onClick={() => {
                                            setSelectedTags(prev => [...prev, tag]);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {tag}
                                    </button>
                                )) : (
                                    <span className="tag-filter-select__empty">Все теги выбраны</span>
                                )}
                            </div>
                        ) : null}
                        </div>
                    </div>
                </div>

                <div className="articles-tools__control">
                    <span className="label mb-0">Сортировка:</span>
                    <SortControl value={sort} options={articleSortOptions} onChange={onSortChange} />
                </div>

                <div className="articles-tools__control articles-tools__control--page-size">
                    <span className="label mb-0">Статей на странице:</span>
                    <SortControl value={String(pageSize)} options={pageSizeOptions} onChange={onPageSizeChange} showSortIcon={false} />
                </div>

                {showViewToggle ? (
                    <div className="articles-tools__control">
                        <span className="label mb-0">Вид:</span>
                        <div className="articles-view-toggle" role="group" aria-label="Способ отображения статей">
                            <button type="button" className={view === "grid" ? "is-active" : ""} onClick={() => onViewChange("grid")} title="Плитка" aria-label="Показать статьи плиткой" aria-pressed={view === "grid"}>
                                <Grid2X2 size={18} />
                            </button>
                            <button type="button" className={view === "list" ? "is-active" : ""} onClick={() => onViewChange("list")} title="Список" aria-label="Показать статьи списком" aria-pressed={view === "list"}>
                                <List size={19} />
                            </button>
                        </div>
                    </div>
                ) : null}

                <button
                    type="button"
                    className="articles-tools__reset"
                    onClick={() => {
                        setSelectedTags([]);
                        onSortChange("newest");
                    }}
                    disabled={selectedTags.length === 0 && sort === "newest"}
                >
                    <RotateCcw size={16} aria-hidden="true" />
                    <span>Сбросить</span>
                </button>

                {selectedTags.length > 0 && (
                    <div className="articles-tools__selected-tags">
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
