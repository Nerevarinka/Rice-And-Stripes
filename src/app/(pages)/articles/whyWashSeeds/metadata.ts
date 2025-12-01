import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/whyWashSeeds/cover.png";

/** Данные о статье "Зачем промывать и замачивать зерносмесь?" */
export const articleInfo: Article = {
    caption: "Зачем промывать и замачивать зерносмесь?",
    link: "/articles/whyWashSeeds",
    cover: articleCover,
    description: "\"Ненавижу, блин, грибы\"",
    publishDate: new Date(2025, 2, 17),
    tags: ["питание", "здоровье"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "Питание амадин",
        "Здоровье амадин",
        "Как проращивать зерно",
        "Грибковое загрязнение кормов для птиц",
        "Замоченное зерно",
        "Плесень в корме"  
    ]
);
