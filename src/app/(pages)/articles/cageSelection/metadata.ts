import { Article } from "@/models";
import type { Metadata } from "next";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/cageSelection/cover.jpg";

export const articleInfo: Article = {
	caption: "Выбор клетки для амадин – головная боль владельца",
	link: "/articles/cageSelection",
	cover: articleCover,
	description: "На что обратить внимание при выборе жилища для птиц",
	publishDate: new Date(2025, 0, 12),
	tags: ["содержание"],
};

export const metadata: Metadata = createArticleMetadata(
	articleInfo,
	[
		"клетка для амадин",
		"выбор клетки",
		"амадины",
		"птицы",
		"содержание амадин",
		"уход за амадинами",
		"жилище для амадин",
		"безопасность амадин",
		"размер клетки",
		"поддон клетки",
		"как выбрать клетку для амадин",
		"какого размера должна быть клетка для амадин",
		"круглая клетка для амадин",
	]
);
