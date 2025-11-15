import { Metadata } from "next";

import { Article } from "@/models";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/letFinchesFly/cover.jpg";

/** Данные о статье "Можно ли выпускать амадин полетать?" */
export const articleInfo: Article = {
    caption: "Можно ли выпускать амадин полетать?",
    link: "/articles/letFinchesFly",
    cover: articleCover,
    description: "Вопрос, открывающий портал в ад. Разбираем все за и против полетов амадин по комнате: опасности, меры безопасности, влияние на психику и физическое здоровье птиц.",
    publishDate: new Date(2025, 2, 23),
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
    ]
);
