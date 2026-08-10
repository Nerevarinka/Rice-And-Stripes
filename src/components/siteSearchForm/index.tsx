"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import "./styles.scss";

export default function SiteSearchForm({ onNavigate }: { onNavigate?: () => void }) {
    return (
        <div className="site-search-link">
            <Link
                href="/search"
                className="site-search-link__button"
                onClick={onNavigate}
                title="Поиск по сайту"
                aria-label="Поиск по сайту"
            >
                <span className="site-search-link__icon" aria-hidden="true"><Search size={20} /></span>
                <span>Поиск</span>
            </Link>
        </div>
    );
}
