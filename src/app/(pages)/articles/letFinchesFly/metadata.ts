import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/letFinchesFly/cover.jpg";

/** Данные о статье "Можно ли выпускать амадин полетать?" */
export const articleInfo: Article = {
    caption: "Можно ли выпускать амадин полетать?",
    link: "/articles/letFinchesFly",
    cover: articleCover,
    description: "Вопрос, открывающий портал в ад...",
    publishDate: new Date(2025, 1, 23),
    tags: ["содержание", "здоровье"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "амадины",
        "птицы",
        "полеты",
        "клетка",
        "безопасность",
        "содержание птиц",
        "выгул",
        "психика птиц",
        "зебровые амадины",
        "уход за птицами",
        "можно ли выпускать амадин полетать",
        "нужно ли амадинам летать по комнате",
        "как подготовить комнату к выгулу амадин",
        "опасность выгула птиц",
    ]
);
