import { createCommonMetadata } from "@/shared/metadata";
import mainLogo from "@/shared/assets/sidebar/mainLogo.png";
import { withBasePath } from "@/shared/utils/withBasePath";
import type { Metadata } from "next";

const title = "Rice & Stripes - Блог о жизни амадин";
const description = "Блог о жизни амадин: уход, наблюдения, наук";
const homeUrl = withBasePath("/");
const logoUrl = mainLogo.src;

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
			width: mainLogo.width,
			height: mainLogo.height,
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
