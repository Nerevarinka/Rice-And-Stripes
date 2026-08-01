import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const TopTenMistakesPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="topTenMistakes">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default TopTenMistakesPage;
