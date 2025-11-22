import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/anatomy/cover.jpg";

/** Данные о статье "Некоторые аспекты анатомии и физиологии птиц, которые стоит знать владельцу" */
export const articleInfo: Article = {
    caption: "Некоторые аспекты анатомии и физиологии птиц, которые стоит знать владельцу",
    link: "/articles/anatomy",
    cover: articleCover,
    description: "Как птицы дышат на выдохе, почему их нельзя долго держать в руке и как они держатся на жердочках - обо всем этом и многом другом можно узнать в нашей новой статье. Мы постарались включить в нее только самое важное и практичное, и, конечно, снабдили текст наглядными картинками.",
    publishDate: new Date(2025, 3, 24),
    tags: ["познавательное", "здоровье"],
};

export const metadata: Metadata = createArticleMetadata(
    articleInfo,
    [
        "анатомия птиц",
        "физиология птиц",
        "амадины",
        "уход за птицами",
        "дыхательная система",
        "пищеварительная система",
        "органы чувств",
        "интеллект птиц",
        "здоровье птиц",
        "владельцы птиц",
    ]
);
