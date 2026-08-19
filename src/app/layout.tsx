// Поллиfills для старых браузеров
import type { Metadata, Viewport } from "next";

import "./globals.scss";

import Sidebar from "@/components/sidebar";
import ScrollProgress from "@/components/scrollProgress";
import JsonLd from "@/components/jsonLd";
import { getAllSidebarItems } from "@/shared/articleCatalog";
import { createSiteStructuredData } from "@/shared/structuredData";
import { siteUrl } from "@/shared/siteConfig";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
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
		<html lang="ru" className="is-clipped" data-theme="light" suppressHydrationWarning>
			<head>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){if(window.matchMedia("(max-width: 767.98px), (hover: none) and (pointer: coarse)").matches){document.documentElement.classList.add("is-mobile");}})();`,
					}}
				/>
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
