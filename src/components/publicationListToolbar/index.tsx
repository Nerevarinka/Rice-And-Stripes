"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";

import SortControl, { type SortOption } from "@/components/sortControl";

import "./styles.scss";

type PublicationListToolbarProps = {
    mobileLabel: string;
    sortValue: string;
    sortOptions: SortOption[];
    onSortChange: (value: string) => void;
    pageSizeLabel: string;
    pageSize: number;
    pageSizeOptions: SortOption[];
    onPageSizeChange: (value: string) => void;
    onReset: () => void;
    resetDisabled: boolean;
    filter?: ReactNode;
    selectedFilters?: ReactNode;
    viewControl?: ReactNode;
};

export default function PublicationListToolbar({
    mobileLabel,
    sortValue,
    sortOptions,
    onSortChange,
    pageSizeLabel,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    onReset,
    resetDisabled,
    filter,
    selectedFilters,
    viewControl,
}: PublicationListToolbarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="publication-list-toolbar">
            <button
                type="button"
                className="publication-list-toolbar__toggle"
                onClick={() => setIsMobileOpen(current => !current)}
                aria-expanded={isMobileOpen}
            >
                <SlidersHorizontal size={18} aria-hidden="true" />
                <span>{mobileLabel}</span>
                <ChevronDown size={18} aria-hidden="true" />
            </button>

            <div className={`publication-list-toolbar__controls${isMobileOpen ? " is-mobile-open" : ""}`}>
                {filter ? <div className="publication-list-toolbar__filter">{filter}</div> : null}
                {selectedFilters ? <div className="publication-list-toolbar__selected">{selectedFilters}</div> : null}

                <div className="publication-list-toolbar__control">
                    <span className="label mb-0">Сортировка:</span>
                    <SortControl value={sortValue} options={sortOptions} onChange={onSortChange} />
                </div>

                <div className="publication-list-toolbar__control publication-list-toolbar__control--page-size">
                    <span className="label mb-0">{pageSizeLabel}</span>
                    <SortControl
                        value={String(pageSize)}
                        options={pageSizeOptions}
                        onChange={onPageSizeChange}
                        showSortIcon={false}
                    />
                </div>

                {viewControl ? <div className="publication-list-toolbar__control">{viewControl}</div> : null}

                <button
                    type="button"
                    className="publication-list-toolbar__reset"
                    onClick={onReset}
                    disabled={resetDisabled}
                >
                    <RotateCcw size={16} aria-hidden="true" />
                    <span>Сбросить</span>
                </button>
            </div>
        </div>
    );
}
