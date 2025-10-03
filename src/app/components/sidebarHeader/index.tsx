import type { FC } from "react";
import { Link } from "react-router";

/* Компонент хедера сайдбара */
const SidebarHeader: FC = () => {
    return (
        <>
            <Link
                to="/"
                className="sidebar-header-title"
            >
                Амадины
                <br />
                Rice & Stripes
            </Link>

            <div className="sidebar-header-description">
                Блог о птицах
            </div>
        </>
    );
};

export default SidebarHeader;
