import type { FC } from "react";
import { Link } from "react-router";

import { sideBarMenu } from "@app/shared";

import "./styles.scss";

import SidebarLinks from "../sidebarLinks";
import SidebarHeader from "../sidebarHeader";

const siteMenu = sideBarMenu.filter(({ visible }) => visible);

const Sidebar: FC = () => {
	return (
		<aside className="sidebar">
			<div className="sidebar-wrapper">
				<div className="main-logo-container">
					<Link to="/">
						<img
							src=".\img\main_logo.png"
							className="sidebar-logo"
							title="Будто логотип кофейни"
						/>
					</Link>
				</div>

				<div className="sidebar-header">
					<SidebarHeader />
				</div>

				<hr className="sidebar-header-hr" />

				<div className="sidebar-body">
					<nav className="sidebar-link-list">
						{siteMenu.map(x =>
							<div
								key={x.link}
								className="sidebar-item"
							>
								<img
									className="finch-hidden-icon"
									src=".\img\zebra_finch_icon.webp"
								/>
								<Link
									to={x.link}
									className={x.isGroup ? "sidebar-link-group-text" : "sidebar-link"}
								>
									{x.caption}
								</Link>
							</div>
						)}
					</nav>
				</div>

				<div className="sidebar-links">
					<SidebarLinks />
				</div>

				<footer className="sidebar-footer">
					© 2025 - Rice & Stripes
					<a
						target="_blank"
						rel="noreferrer"
						title="Страница проекта на Гитхабе"
						href="https://github.com/Nerevarinka/Rice-And-Stripes"
					>
						<i className="bi bi-github sidebar-gh-icon" />
					</a>
				</footer>
			</div>
		</aside>
	);
};

export default Sidebar;
