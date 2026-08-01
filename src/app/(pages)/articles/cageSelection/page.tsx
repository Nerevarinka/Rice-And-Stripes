import { type FC } from "react";

import StaticArticleReadingTime from "@/components/staticArticleReadingTime";

import Article from "./article";
export { metadata } from "./metadata";

const CageSelectionPage: FC = () => {
    return (
        <StaticArticleReadingTime slug="cageSelection">
            <Article />
        </StaticArticleReadingTime>
    );
};

export default CageSelectionPage;
