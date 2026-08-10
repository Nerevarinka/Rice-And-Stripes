"use client";

import { useEffect } from "react";
import Link from "next/link";

import { withBasePath } from "@/shared/utils/withBasePath";

export default function LegacyArticleRedirect({ href }: { href: string }) {
    useEffect(() => {
        window.location.replace(withBasePath(href));
    }, [href]);

    return (
        <div className="article-content-wrapper">
            <div className="article-content content">
                <p>Статья переехала на новый адрес.</p>
                <Link href={href}>Открыть статью</Link>
            </div>
        </div>
    );
}
