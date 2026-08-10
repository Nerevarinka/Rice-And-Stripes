"use client";

import type { FC, PropsWithChildren } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import "./styles.scss";

const ArticlesLayout: FC<PropsWithChildren> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();

	const isArticlePage = pathname !== "/articles" && pathname.startsWith("/articles/");

	return (
		<>
			{isArticlePage && (
				<button className="button is-light p-3 article-back-button" onClick={() => router.replace("/articles")} aria-label="Вернуться к статьям">
					<ArrowLeft size={15} />
					<span>К статьям</span>
				</button>
			)}
			{children}
		</>
	);
};

export default ArticlesLayout;
