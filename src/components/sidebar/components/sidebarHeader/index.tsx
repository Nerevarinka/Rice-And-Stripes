import Link from "next/link";
import { FC } from "react";

/* Компонент хедера сайдбара */
const SidebarHeader: FC = () => {
    return (
        <>
            <Link
                href="/"
                className="sidebar-header-title"
            >
                Rice & Stripes
            </Link>

            <div className="sidebar-header-description">
                Блог о жизни амадин
            </div>
        </>
    );
};

export default SidebarHeader;
