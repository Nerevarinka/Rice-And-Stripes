"use client";

import type { FC, PropsWithChildren } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import "./styles.scss";

const ArticlesLayout: FC<PropsWithChildren> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();

	// Показываем кнопку только если мы находимся в конкретной статье (не на главной странице статей)
	const isArticlePage = pathname !== "/articles" && pathname.startsWith("/articles/");

	return (
		<>
			{isArticlePage && (
				<button className="back-button" onClick={() => router.back()} aria-label="Вернуться назад">
					<ArrowLeft size={20} />
					<span>Назад</span>
				</button>
			)}
			{children}
		</>
	);
};

export default ArticlesLayout;
