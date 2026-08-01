import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const NailBeakTrimmingPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="nailBeakTrimming">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default NailBeakTrimmingPage;
