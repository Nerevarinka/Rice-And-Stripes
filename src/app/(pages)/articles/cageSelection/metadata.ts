import { Article } from "@/models";
import type { Metadata } from "next";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/cageSelection/cover.jpg";

export const articleInfo: Article = {
	caption: "Выбор клетки для амадин – головная боль владельца",
	link: "/articles/cageSelection",
	cover: articleCover,
	description: "На что обратить внимание при выборе жилища для птиц. Разбираем важные характеристики клеток: размеры, материалы, конструкция, безопасность для амадин.",
	publishDate: new Date(2025, 1, 12)
};

export const metadata: Metadata = createArticleMetadata(
	articleInfo,
	[
		"клетка для амадин",
		"выбор клетки",
		"амадины",
		"птицы",
		"владельцы",
		"уход за птицами",
		"жилище для птиц",
		"безопасность птиц",
		"размер клетки",
		"поддон клетки",
	]
);
