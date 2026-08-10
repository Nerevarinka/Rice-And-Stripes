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
				<button className="button is-light p-3 notes-back-button" onClick={() => router.replace("/notes")} aria-label="Вернуться к заметкам">
					<ArrowLeft size={15} />
					<span>К заметкам</span>
				</button>
			)}
			{children}
		</>
	);
};

export default NotesLayout;
