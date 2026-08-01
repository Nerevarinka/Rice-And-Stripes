import type { FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const ZebraFinchesNatureDietPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="zebraFinchesNatureDiet">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default ZebraFinchesNatureDietPage;
