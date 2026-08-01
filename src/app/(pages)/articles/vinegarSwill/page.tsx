import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const VinegarSwillPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="vinegarSwill">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default VinegarSwillPage;
