import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const LetFinchesFlyPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="letFinchesFly">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default LetFinchesFlyPage;
