import type { Metadata } from "next";

import { displayName } from "../../package.json";
import { createCommonMetadata } from "@/shared/metadata";

export const metadata: Metadata = createCommonMetadata(
	`Главная страница | ${displayName}`,
	"Блог о маленьких птицах с большими требованиями. Этот сайт был создан владельцами для владельцев. Здесь вы найдёте статьи и другие материалы об амадинах - представителях семейства вьюрковых ткачиков.",
	[
		"амадины",
		"птицы",
		"анатомия",
		"физиология",
		"уход",
		"содержание",
		"статьи",
		"советы",
	]
);
