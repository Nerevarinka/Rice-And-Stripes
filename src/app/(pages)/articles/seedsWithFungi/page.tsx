import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const SeedsWithFungiPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="seedsWithFungi">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default SeedsWithFungiPage;
