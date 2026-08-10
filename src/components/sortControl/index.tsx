"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import "./styles.scss";

export type SortOption = {
    value: string;
    label: string;
};

type SortControlProps = {
    value: string;
    options: SortOption[];
    onChange: (value: string) => void;
    showSortIcon?: boolean;
};

export default function SortControl({ value, options, onChange, showSortIcon = true }: SortControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(option => option.value === value) ?? options[0];

    useEffect(() => {
        const closeOutside = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    return (
        <div ref={rootRef} className={`sort-control${showSortIcon ? "" : " sort-control--without-icon"}${isOpen ? " is-open" : ""}`}>
            <button
                type="button"
                className="sort-control__trigger"
                onClick={() => setIsOpen(current => !current)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {showSortIcon ? <ArrowUpDown size={17} aria-hidden="true" /> : null}
                <span>{selectedOption.label}</span>
                <ChevronDown size={17} aria-hidden="true" />
            </button>
            {isOpen ? (
                <div className="sort-control__menu" role="listbox" aria-label="Порядок материалов">
                    {options.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            className={`sort-control__option${option.value === value ? " is-selected" : ""}`}
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
