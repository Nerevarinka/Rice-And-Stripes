"use client";

import type { FC, PropsWithChildren } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const NotesLayout: FC<PropsWithChildren> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();

	const isNotePage = pathname !== "/notes" && pathname.startsWith("/notes/");

	return (
		<>
			{isNotePage && (
				<button className="back-button" onClick={() => router.back()} aria-label="Вернуться назад">
					<ArrowLeft size={20} />
					<span>Назад</span>
				</button>
			)}
			{children}
		</>
	);
};

export default NotesLayout;
