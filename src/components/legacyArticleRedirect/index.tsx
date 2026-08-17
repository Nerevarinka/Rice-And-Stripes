"use client";

import { useEffect } from "react";
import Link from "next/link";

import { withBasePath } from "@/shared/utils/withBasePath";

export default function LegacyArticleRedirect({ href }: { href: string }) {
    const targetHref = withBasePath(href);

    useEffect(() => {
        window.location.replace(targetHref);
    }, [targetHref]);

    return (
        <div className="article-content-wrapper">
            <meta httpEquiv="refresh" content={`0;url=${targetHref}`} />
            <div className="article-content content">
                <p>Материал переехал на новый адрес.</p>
                <Link href={href}>Открыть материал</Link>
            </div>
        </div>
    );
}
