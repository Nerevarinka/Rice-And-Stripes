import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const SproutingSeedMixPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="sproutingSeedMix">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default SproutingSeedMixPage;
