import { createCommonMetadata } from "@/shared/metadata";
import { withBasePath } from "@/shared/utils/withBasePath";
import type { Metadata } from "next";

const title = "Rice & Stripes - Блог о жизни амадин";
const description = "Блог о жизни амадин: уход, наблюдения, наука";
const homeUrl = withBasePath("/");
const logoUrl = withBasePath("/logoV2-preview.jpg");

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
		images: [{
			url: logoUrl,
			width: 600,
			height: 600,
			type: "image/jpeg",
			alt: "Rice & Stripes",
		}],
	},
	twitter: {
		card: "summary",
		title,
		description,
		images: [logoUrl],
	},
	alternates: {
		canonical: homeUrl,
	},
};
