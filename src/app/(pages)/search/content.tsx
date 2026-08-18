"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import type { SearchItem } from "@/models";
import SortControl, { type SortOption } from "@/components/sortControl";

import "./styles.scss";

type SearchScope = "all" | "articles" | "notes";
type SearchSort = "relevance" | "newest" | "oldest" | "title";

const searchSortOptions: SortOption[] = [
    { value: "relevance", label: "По релевантности" },
    { value: "newest", label: "Сначала новые" },
    { value: "oldest", label: "Снача старые" },
    { value: "title", label: "По названию А–Я" },
];

const validScopes: SearchScope[] = ["all", "articles", "notes"];
const validSorts: SearchSort[] = ["relevance", "newest", "oldest", "title"];

function formatPublishDate(value: string) {
    const [year, month, day] = value.slice(0, 10).split("-");
    return `${day}.${month}.${year}`;
}

function normalize(value: string) {
    return value
        .toLocaleLowerCase("ru-RU")
        .replace(/ё/g, "е")
        .replace(/[^a-zа-я0-9]+/gi, " ")
        .trim();
}

function scoreItem(item: SearchItem, query: string) {
    const normalizedQuery = normalize(query);
    const tokens = normalizedQuery.split(/\s+/).filter(token => token.length >= 2);
    if (tokens.length === 0) return 0;

    const title = normalize(item.title);
    const description = normalize(item.description);
    const body = normalize(item.searchText);
    if (!tokens.every(token => body.includes(token))) return 0;

    let score = tokens.reduce((total, token) => {
        if (title === token) return total + 120;
        if (title.startsWith(token)) return total + 70;
        if (title.includes(token)) return total + 45;
        if (description.includes(token)) return total + 20;
        return total + 5;
    }, 0);

    if (title.includes(normalizedQuery)) score += 100;
    if (description.includes(normalizedQuery)) score += 35;
    return score;
}

export default function SearchResults({ items }: { items: SearchItem[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q")?.trim() ?? "";
    const scopeParam = searchParams.get("scope") as SearchScope | null;
    const sortParam = searchParams.get("sort") as SearchSort | null;
    const scope: SearchScope = scopeParam && validScopes.includes(scopeParam) ? scopeParam : "all";
    const sort: SearchSort = sortParam && validSorts.includes(sortParam) ? sortParam : "relevance";
    const [inputValue, setInputValue] = useState(query);

    useEffect(() => {
        queueMicrotask(() => setInputValue(query));
    }, [query]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextQuery = inputValue.trim();
        router.push(nextQuery.length >= 2 ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
    };

    const clear = () => {
        setInputValue("");
        router.replace("/search");
    };

    const updateOptions = (nextScope: SearchScope, nextSort: SearchSort) => {
        const params = new URLSearchParams(searchParams.toString());
        if (nextScope === "all") params.delete("scope");
        else params.set("scope", nextScope);
        if (nextSort === "relevance") params.delete("sort");
        else params.set("sort", nextSort);
        const nextQuery = params.toString();
        router.replace(nextQuery ? `/search?${nextQuery}` : "/search");
    };

    const results = useMemo(() => query.length >= 2
        ? items
            .filter(item => scope === "all" || (scope === "articles" ? item.kind === "Статья" : item.kind === "Заметка"))
            .map(item => ({ item, score: scoreItem(item, query) }))
            .filter(result => result.score > 0)
            .sort((left, right) => {
                if (sort === "title") return left.item.title.localeCompare(right.item.title, "ru");
                if (sort === "newest" || sort === "oldest") {
                    const leftDate = left.item.publishDate ? Date.parse(left.item.publishDate) : null;
                    const rightDate = right.item.publishDate ? Date.parse(right.item.publishDate) : null;
                    if (leftDate === null) return 1;
                    if (rightDate === null) return -1;
                    return sort === "newest" ? rightDate - leftDate : leftDate - rightDate;
                }
                return right.score - left.score;
            })
        : [], [items, query, scope, sort]);

    return (
        <section className="site-search-page mx-4">
            <div className="site-search-page__heading">
                <Search aria-hidden="true" />
                <h1 className="title is-2">Поиск по сайту</h1>
            </div>

            <form className="site-search-page__form" role="search" onSubmit={submit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={event => setInputValue(event.target.value)}
                    placeholder="Введите одно или несколько слов"
                    aria-label="Поиск по сайту"
                    minLength={2}
                    autoFocus
                />
                {inputValue ? (
                    <button className="site-search-page__clear" type="button" onClick={clear} title="Очистить" aria-label="Очистить поле поиска">
                        <X size={18} />
                    </button>
                ) : null}
                <button className="site-search-page__submit" type="submit" title="Найти" aria-label="Найти">
                    <Search size={19} />
                </button>
            </form>

            <div className="site-search-options" aria-label="Настройки поиска">
                <div className="site-search-options__group">
                    <span className="site-search-options__label">Искать в:</span>
                    <div className="site-search-scope" role="group" aria-label="Область поиска">
                        {([
                            ["all", "Весь сайт"],
                            ["articles", "Статьи"],
                            ["notes", "Заметки"],
                        ] as const).map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                className={scope === value ? "is-active" : ""}
                                aria-pressed={scope === value}
                                onClick={() => updateOptions(value, sort)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="site-search-options__group">
                    <span className="site-search-options__label">Сортировка:</span>
                    <SortControl
                        value={sort}
                        options={searchSortOptions}
                        onChange={value => updateOptions(scope, value as SearchSort)}
                    />
                </div>
            </div>

            {query.length < 2 ? null : results.length === 0 ? (
                <p className="site-search-page__empty">По запросу «{query}» ничего не найдено.</p>
            ) : (
                <>
                    <p className="site-search-page__summary">
                        По запросу «{query}» найдено: {results.length}
                    </p>
                    <div className="site-search-results">
                        {results.map(({ item }) => (
                            <article className="site-search-result" key={`${item.kind}-${item.link}`}>
                                <div className="site-search-result__meta">
                                    <span className="site-search-result__kind">{item.kind}</span>
                                    {item.publishDate ? (
                                        <time dateTime={item.publishDate}>
                                            Опубликовано: {formatPublishDate(item.publishDate)}
                                        </time>
                                    ) : null}
                                </div>
                                <h2><Link href={item.link}>{item.title}</Link></h2>
                                {item.description ? <p>{item.description}</p> : null}
                            </article>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
