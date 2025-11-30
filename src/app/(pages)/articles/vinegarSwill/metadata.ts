import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/vinegarSwill/cover.jpg";

/** Данные о статье "Уксусное пойло" */
export const articleInfo: Article = {
    caption: "Уксусное пойло",
    link: "/articles/vinegarSwill",
    cover: articleCover,
    description: "Чтобы амадины были здоровы, нужно всего лишь...",
    publishDate: new Date(2025, 2, 31),
    tags: ["питание", "здоровье"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "Питание амадин",
        "Здоровье амадин",
        "Яблочный уксус",
        "Зачем давать птицам уксус",
        "Вредные советы",   
    ]
);
