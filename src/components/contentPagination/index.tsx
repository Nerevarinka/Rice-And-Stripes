"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import "./styles.scss";

type ContentPaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function ContentPagination({ currentPage, totalPages, onPageChange }: ContentPaginationProps) {
    if (totalPages <= 1) return null;

    const goTo = (page: number) => onPageChange(Math.min(totalPages, Math.max(1, page)));
    const isFirst = currentPage === 1;
    const isLast = currentPage === totalPages;

    return (
        <nav className="content-pagination" aria-label="Навигация по страницам">
            <button type="button" onClick={() => goTo(1)} disabled={isFirst} title="Первая страница" aria-label="Первая страница">
                <ChevronsLeft size={19} />
            </button>
            <button type="button" onClick={() => goTo(currentPage - 1)} disabled={isFirst} title="Предыдущая страница" aria-label="Предыдущая страница">
                <ChevronLeft size={19} />
            </button>
            <span className="content-pagination__status">Страница {currentPage} из {totalPages}</span>
            <button type="button" onClick={() => goTo(currentPage + 1)} disabled={isLast} title="Следующая страница" aria-label="Следующая страница">
                <ChevronRight size={19} />
            </button>
            <button type="button" onClick={() => goTo(totalPages)} disabled={isLast} title="Последняя страница" aria-label="Последняя страница">
                <ChevronsRight size={19} />
            </button>
        </nav>
    );
}
