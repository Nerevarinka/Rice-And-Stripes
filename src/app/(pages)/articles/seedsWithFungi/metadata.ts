import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/seedsWithFungi/cover.png";

/** Данные о статье "Ненавижу, блин, грибы: что не так с зерносмесями для птиц" */
export const articleInfo: Article = {
    caption: "Ненавижу, блин, грибы: что не так с зерносмесями для птиц",
    link: "/articles/seedsWithFungi",
    cover: articleCover,
    description: "Про плесень и микотоксины",
    publishDate: new Date(2026, 3, 16),
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
