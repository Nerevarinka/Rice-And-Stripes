import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const TamedFinches: FC = () => {
    return (
        <StaticArticleReadingTime slug="tamedFinches">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default TamedFinches;
