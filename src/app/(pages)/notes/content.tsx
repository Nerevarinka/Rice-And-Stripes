"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

import StickyNote from "@/components/stickyNote";
import SortControl, { type SortOption } from "@/components/sortControl";
import ContentPagination from "@/components/contentPagination";
import type { Note } from "@/models";

import "./styles.scss";

type NotesSort = "newest" | "oldest" | "title-asc" | "title-desc";

const noteSortOptions: SortOption[] = [
    { value: "newest", label: "Сначала новые" },
    { value: "oldest", label: "Сначала старые" },
    { value: "title-asc", label: "По названию А–Я" },
    { value: "title-desc", label: "По названию Я–А" },
];
const pageSizeOptions: SortOption[] = [12, 24, 48].map(value => ({
    value: String(value),
    label: String(value),
}));

export default function NotesContainer({ notes }: { notes: Note[] }) {
    const [sort, setSort] = useState<NotesSort>("newest");
    const [pageSize, setPageSize] = useState(24);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedSort = window.localStorage.getItem("notes-sort") as NotesSort | null;
        if (noteSortOptions.some(option => option.value === savedSort)) setSort(savedSort!);
        const savedPageSize = Number(window.localStorage.getItem("notes-page-size"));
        if ([12, 24, 48].includes(savedPageSize)) setPageSize(savedPageSize);
    }, []);

    const selectSort = (nextSort: string) => {
        const value = nextSort as NotesSort;
        setSort(value);
        window.localStorage.setItem("notes-sort", value);
    };

    const selectPageSize = (nextSize: string) => {
        const value = Number(nextSize);
        setPageSize(value);
        window.localStorage.setItem("notes-page-size", String(value));
    };

    const sortedNotes = useMemo(() => [...notes].sort((left, right) => {
        switch (sort) {
            case "oldest": return left.publishDate.getTime() - right.publishDate.getTime();
            case "title-asc": return (left.caption ?? "").localeCompare(right.caption ?? "", "ru");
            case "title-desc": return (right.caption ?? "").localeCompare(left.caption ?? "", "ru");
            default: return right.publishDate.getTime() - left.publishDate.getTime();
        }
    }), [notes, sort]);

    useEffect(() => setCurrentPage(1), [sort, pageSize]);

    const totalPages = Math.max(1, Math.ceil(sortedNotes.length / pageSize));
    const pagedNotes = sortedNotes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const changePage = (page: number) => {
        setCurrentPage(page);
        requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };

    return (
        <section className="notes-page mx-4">
            <h2 className="title is-2">Заметки</h2>
            <p className="notes-page__intro">
                Короткие заметки, наблюдения и маленькие советы. Заметка может перерасти в статью.
            </p>

            <button
                type="button"
                className="notes-tools-toggle"
                onClick={() => setIsMobilePanelOpen(current => !current)}
                aria-expanded={isMobilePanelOpen}
            >
                <SlidersHorizontal size={18} aria-hidden="true" />
                <span>Сортировка</span>
                <ChevronDown size={18} aria-hidden="true" />
            </button>

            <div className={`notes-tools${isMobilePanelOpen ? " is-mobile-open" : ""}`}>
                <div className="notes-tools__control">
                    <span className="label mb-0">Сортировка:</span>
                    <SortControl value={sort} options={noteSortOptions} onChange={selectSort} />
                </div>
                <div className="notes-tools__control notes-tools__control--page-size">
                    <span className="label mb-0">Заметок на странице:</span>
                    <SortControl value={String(pageSize)} options={pageSizeOptions} onChange={selectPageSize} showSortIcon={false} />
                </div>
                <button
                    type="button"
                    className="notes-tools__reset"
                    onClick={() => selectSort("newest")}
                    disabled={sort === "newest"}
                >
                    <RotateCcw size={16} aria-hidden="true" />
                    <span>Сбросить</span>
                </button>
            </div>

            <div ref={listRef} className="notes-grid">
                {pagedNotes.map((note, index) => (
                    <StickyNote key={note.link} note={note} decorationIndex={index} />
                ))}
            </div>

            <ContentPagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />

            {sortedNotes.length === 0 ? (
                <div className="notification is-warning">Заметок пока нет</div>
            ) : null}
        </section>
    );
}
