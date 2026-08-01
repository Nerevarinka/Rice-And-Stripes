import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const IodineObsessionPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="iodineObsession">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default IodineObsessionPage;
