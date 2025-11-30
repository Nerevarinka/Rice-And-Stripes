import { Article } from "@/models";
import type { Metadata } from "next";
import { createArticleMetadata } from "@/shared/metadata";

import articleCover from "@/shared/assets/articles/nailBeakTrimming/cover.png";

export const articleInfo: Article = {
	caption: "Стрижка когтей и клюва",
	link: "/articles/nailBeakTrimming",
	cover: articleCover,
	description: "Все нюансы - как, чем, когда...",
	publishDate: new Date(2025, 4, 7),
	tags: ["содержание", "здоровье"],
};

export const metadata: Metadata = createArticleMetadata(
	articleInfo,
	[
		"амадины",
		"птицы",
		"содержание амадин",
		"уход за амадинами",
		"здоровье амадин",
        "как подстричь когти амадине",
        "как подстричь клюв амадине",
        "почему отрастает клюв у амадины",
	]
);
