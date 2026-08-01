import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const AnatomyPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="anatomy">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default AnatomyPage;
