// Поллиfills для старых браузеров
import "core-js/stable";
import "whatwg-fetch";
import "abort-controller/polyfill";
import "url-search-params-polyfill";

import type { Metadata } from "next";

import "./globals.scss";

import Sidebar from "@/components/sidebar";
import MobileFlag from "@/components/mobileFlag";
import ScrollProgress from "@/components/scrollProgress";
import { getAllSidebarItems } from "@/shared/articleCatalog";

export const metadata: Metadata = {
	metadataBase: new URL("https://nerevarinka.github.io"),
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
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){var ua=navigator.userAgent||navigator.vendor||"";if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(ua)||window.innerWidth<768){document.documentElement.classList.add("is-mobile");document.documentElement.style.setProperty("--is-mobile","1");}})();`,
					}}
				/>
			</head>
			<body className="antialiased is-clipped">
				<MobileFlag />
				<div className="is-flex is-clipped" style={{ height: "100vh" }}>
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
