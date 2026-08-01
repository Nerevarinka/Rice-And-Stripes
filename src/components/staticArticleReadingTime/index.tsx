import type { PropsWithChildren } from "react";

import { getStaticArticleReadingTime } from "@/shared/articleCatalog";
import { articles } from "@/shared/articles";

import StaticArticleReadingTimeIndicator from "./indicator";

export default async function StaticArticleReadingTime({
    slug,
    children,
}: PropsWithChildren<{ slug: string }>) {
    const minutes = await getStaticArticleReadingTime(slug);
    const article = articles.find(item => item.link.split("/").filter(Boolean).at(-1) === slug);

    return (
        <>
            {children}
            {minutes && article ? (
                <StaticArticleReadingTimeIndicator
                    minutes={minutes}
                    publishDate={article.publishDate.toISOString()}
                />
            ) : null}
        </>
    );
}
