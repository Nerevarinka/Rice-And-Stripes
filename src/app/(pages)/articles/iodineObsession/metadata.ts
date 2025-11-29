import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/iodineObsession/cover.jpg";

/** Данные о статье "Йодовая одержимость" */
export const articleInfo: Article = {
    caption: "Йодовая одержимость",
    link: "/articles/iodineObsession",
    cover: articleCover,
    description: "Всем амадинам нужно дополнительно давать йод. Или нет?",
    publishDate: new Date(2025, 2, 1),
    tags: ["питание", "здоровье"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "здоровье амадин",
        "физиология птиц",
        "амадины",
        "йод",
        "ламинария",
        "амадина полысела",
        "облысение гульдовых амадин"
    ]
);
