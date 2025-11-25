import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/tamedFinches/cover.jpg";

/** Данные о статье "Можно ли приручить амадин?" */
export const articleInfo: Article = {
    caption: "Можно ли приручить амадин?",
    link: "/articles/tamedFinches",
    cover: articleCover,
    description: "Разбираем причины возникновения мифа и разрушаем его",
    publishDate: new Date(2025, 2, 23),
    tags: ["содержание"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "амадины",
        "птицы",
        "приручение",
        "клетка",
        "безопасность",
        "содержание птиц",
        "психика птиц",
        "зебровые амадины",
        "рисовые амадины",
        "японские амадины",
        "гульдовы амадины",
        "уход за птицами",
    ]
);
