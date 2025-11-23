import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/topTenMistakes/cover.jpg";

/** Данные о статье "Топ-10 раздражающих ошибок новичков" */
export const articleInfo: Article = {
    caption: "Топ-10 раздражающих ошибок новичков",
    link: "/articles/topTenMistakes",
    cover: articleCover,
    description: "Что неправильно делают начинающие владельцы и как это исправить.",
    publishDate: new Date(2025, 3, 1),
    tags: ["познавательное"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    []
);
