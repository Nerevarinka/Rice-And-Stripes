import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/zebraFinchesNatureDiet/cover.png";

/** Данные о статье "Питание зебровых амадин в природе" */
export const articleInfo: Article = {
    caption: "Питание зебровых амадин в природе",
    link: "/articles/zebraFinchesNatureDiet",
    cover: articleCover,
    description: "Что, где, когда и как едят зебровые амадины в естественных условиях",
    publishDate: new Date(2025, 3, 8),
    tags: ["питание", "познавательное"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "питание",
        "зебровые амадины",
        "диета амадин",
        "семена",
        "птицы",
        "природа",
        "австралия",
        "что едят амадины в природе",
        "чем питаются амадины в природе"
    ]
);
