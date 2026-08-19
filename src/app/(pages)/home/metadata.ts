import { createCommonMetadata, DEFAULT_SOCIAL_IMAGE } from "@/shared/metadata";
import { absoluteSiteUrl } from "@/shared/siteConfig";
import type { Metadata } from "next";

const title = "Rice & Stripes - Блог о жизни амадин";
const description = "Блог о жизни амадин: уход, наблюдения, наука";
const homeUrl = absoluteSiteUrl("/");

const baseMetadata = createCommonMetadata(
	title,
	description,
	[
		"Амадины",
		"Содержание амадин",
		"Сайт об амадинах",
		"Амадины ВКонтакте",
		"Амадины Телеграм",
	]
);

export const metadata: Metadata = {
	...baseMetadata,
	openGraph: {
		...baseMetadata.openGraph,
		title,
		description,
		type: "website",
		url: homeUrl,
		images: [DEFAULT_SOCIAL_IMAGE],
	},
	twitter: {
		card: "summary",
		title,
		description,
		images: [DEFAULT_SOCIAL_IMAGE.url],
	},
	alternates: {
		canonical: homeUrl,
	},
};
