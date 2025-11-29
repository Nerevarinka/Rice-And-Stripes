import { Geist, Geist_Mono } from "next/font/google";

// Полифиллы для старых браузеров
import "core-js/stable";
import "whatwg-fetch";
import "abort-controller/polyfill";
import "url-search-params-polyfill";

import "./globals.scss";

import Sidebar from "@/components/sidebar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru" className="is-clipped" data-theme="light">
			<head>
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased is-clipped`}
			>
				<div className="is-flex is-clipped" style={{ height: '100vh' }}>
					<Sidebar />
					<main className="is-flex-grow-1 pt-2 pl-4 main-content" style={{ overflowY: 'auto' }}>
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
