// Поллиfills для старых браузеров
import type { Metadata, Viewport } from "next";

import "./globals.scss";

import Sidebar from "@/components/sidebar";
import ScrollProgress from "@/components/scrollProgress";
import JsonLd from "@/components/jsonLd";
import { getAllSidebarItems } from "@/shared/articleCatalog";
import { createSiteStructuredData } from "@/shared/structuredData";
import { siteConfig, siteUrl } from "@/shared/siteConfig";
import { DEFAULT_SOCIAL_IMAGE } from "@/shared/metadata";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: siteConfig.name,
	description: siteConfig.description,
	openGraph: {
		title: siteConfig.name,
		description: siteConfig.description,
		type: "website",
		siteName: siteConfig.name,
		locale: "ru_RU",
		images: [DEFAULT_SOCIAL_IMAGE],
	},
	twitter: {
		card: "summary",
		title: siteConfig.name,
		description: siteConfig.description,
		images: [DEFAULT_SOCIAL_IMAGE.url],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const menuItems = await getAllSidebarItems();

	return (
		<html lang="ru" className="is-clipped" data-theme="light">
			<head>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			</head>
			<body className="antialiased is-clipped">
				<JsonLd data={createSiteStructuredData()} />
				<div className="is-flex is-clipped site-shell">
					<Sidebar menuItems={menuItems} />
					<main className="is-flex-grow-1 pt-2 pl-4 main-content" style={{ overflowY: "auto" }}>
						<ScrollProgress />
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
