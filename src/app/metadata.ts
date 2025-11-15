import type { Metadata } from "next";

import { displayName } from "../../package.json";
import { createCommonMetadata } from "@/shared/metadata";

export const metadata: Metadata = createCommonMetadata(
	`Главная страница | ${displayName}`,
	"",
	["амадины", "птицы", "анатомия", "физиология", "уход", "содержание", "статьи", "советы"]
);
// TODO
