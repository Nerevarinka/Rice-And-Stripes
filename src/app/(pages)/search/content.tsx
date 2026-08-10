"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import type { SearchItem } from "@/models";

import "./styles.scss";

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
    const [inputValue, setInputValue] = useState(query);

    useEffect(() => setInputValue(query), [query]);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextQuery = inputValue.trim();
        router.push(nextQuery.length >= 2 ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
    };

    const clear = () => {
        setInputValue("");
        router.replace("/search");
    };
    const results = query.length >= 2
        ? items
            .map(item => ({ item, score: scoreItem(item, query) }))
            .filter(result => result.score > 0)
            .sort((left, right) => right.score - left.score)
        : [];

    return (
        <section className="site-search-page">
            <div className="site-search-page__heading">
                <Search size={25} />
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
                                <span className="site-search-result__kind">{item.kind}</span>
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
