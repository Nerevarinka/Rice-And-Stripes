// Поллиfills для старых браузеров
import "core-js/stable";
import "whatwg-fetch";
import "abort-controller/polyfill";
import "url-search-params-polyfill";

import "./globals.scss";

import Sidebar from "@/components/sidebar";
import MobileFlag from "@/components/mobileFlag";
import { getAllSidebarItems } from "@/shared/articleCatalog";

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
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body className="antialiased is-clipped">
				<MobileFlag />
				<div className="is-flex is-clipped" style={{ height: "100vh" }}>
					<Sidebar menuItems={menuItems} />
					<main className="is-flex-grow-1 pt-2 pl-4 main-content" style={{ overflowY: "auto" }}>
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
