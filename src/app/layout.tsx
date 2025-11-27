import { Geist, Geist_Mono } from "next/font/google";

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
		<html lang="ru" className="is-clipped">
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
