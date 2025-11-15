import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/zebraFinchesNatureDiet/cover.jpg";

/** Данные о статье "Некоторые аспекты анатомии и физиологии птиц, которые стоит знать владельцу" */
export const articleInfo: Article = {
    caption: "Питание зебровых амадин в природе",
    link: "/articles/zebraFinchesNatureDiet",
    cover: articleCover,
    description: "Что, где, когда и как едят зебровые амадины в естественных условиях.",
    publishDate: new Date(2025, 4, 8)
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "питание",
        "зебровые амадины",
        "диета",
        "семена",
        "птицы",
        "природа",
        "автралия",
    ]
);
