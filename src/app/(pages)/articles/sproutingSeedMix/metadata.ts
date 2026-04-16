import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/sproutingSeedMix/cover.png";

/** Данные о статье "Как сделать зерно для птиц безопаснее и полезнее" */
export const articleInfo: Article = {
    caption: "Как сделать зерно для птиц безопаснее и полезнее",
    link: "/articles/sproutingSeedMix",
    cover: articleCover,
    description: "Способы обработки зерна для птиц. Промывание, замачивание и проращивание. Польза, риски, приготовление пророста",
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
