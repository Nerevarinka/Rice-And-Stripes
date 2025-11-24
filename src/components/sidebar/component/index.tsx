"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { siGithub } from "simple-icons";

import { useIsMobile } from "@/hooks/useIsMobile";

import sidebarItemIcon from "@/shared/assets/sidebar/zebraFinchIcon.webp";
import mainLogo from "@/shared/assets/sidebar/mainLogo.png";

import "./styles.scss";
import { sideBarMenu } from "./items";

import SidebarHeader from "../components/sidebarHeader";
import SidebarLinks from "../components/sidebarLinks";

const today = new Date();

export default function Sidebar() {
	const pathname = usePathname();
	const [showNested, setShowNested] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isMobile = useIsMobile();

	// Check if we're on 404 page (any path that doesn't match our routes)
	const isValidRoute = useMemo(() => sideBarMenu.some(item =>
		pathname === item.link ||
		(pathname.startsWith(item.link + "/") &&
			(item.children && item.children.some(child => pathname === child.link))
		)
	), [pathname]);

	useEffect(() => {
		const hideTimer = setTimeout(() => setShowNested(false), 0);
		const showTimer = setTimeout(() => setShowNested(true), 50);
		return () => {
			clearTimeout(hideTimer);
			clearTimeout(showTimer);
		};
	}, [pathname]);

	const handleLinkClick = () => {
		if (isMobile) {
			setIsMobileMenuOpen(false);
		}
	};

	return (
		<>
			{isMobile && (
				<button
					className={`sidebar-burger${isMobileMenuOpen ? ' sidebar-burger--open' : ''}`}
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					aria-label="Toggle menu"
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
			)}
			{isMobile && isMobileMenuOpen && (
				<div
					className="sidebar-overlay"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}
			<aside className={`sidebar is-flex-shrink-0${isMobile && isMobileMenuOpen ? ' sidebar--mobile-open' : ''}${isMobile ? ' sidebar--mobile' : ''}`} style={{ overflowY: "auto" }}>
				<div className="sidebar-wrapper is-flex is-flex-direction-column">
				<div className="is-flex is-justify-content-center">
					<Link href="/">
						<Image
							src={mainLogo}
							alt="Logo"
							width={160}
							height={160}
							className="sidebar-logo is-flex is-flex-direction-column"
							title="Будто логотип кофейни"
						/>
					</Link>
				</div>

				<div className="sidebar-header is-flex is-flex-direction-column is-align-items-center has-text-centered">
					<SidebarHeader />
				</div>

				<hr className="sidebar-header-hr" />

				<div className="is-flex-grow-1">
					<nav className="is-flex is-flex-direction-column">
						{sideBarMenu.map(x => (
							<div key={x.link}>
								<div className={`sidebar-item is-flex is-align-items-center${isValidRoute && pathname.startsWith(x.link) ? ' is-active' : ''}`}>
									<Image
										src={sidebarItemIcon}
										alt="Sidebar item icon"
										width={16}
										height={16}
										className="finch-hidden-icon"
									/>
									<Link
										href={x.link}
										className={x.isGroup ? "sidebar-link-group-text is-flex is-flex-direction-column" : "sidebar-link"}
										onClick={handleLinkClick}
									>
										{x.caption}
									</Link>
								</div>
								{x.children && x.children.filter(child => pathname === child.link).length > 0 && showNested && (
									<div className="sidebar-nested-items">
										{x.children
											.filter(child => pathname === child.link)
											.map(child => (
												<div key={child.link} className="sidebar-nested-item">
													<span
														className="sidebar-nested-link sidebar-nested-link--active"
														title={child.caption}
													>
														{child.caption.length > 20 ? child.caption.slice(0, 20) + '...' : child.caption}
													</span>
												</div>
											))}
									</div>
								)}
							</div>
						))}
					</nav>
				</div>

				<div className="sidebar-links is-flex is-align-items-center is-justify-content-center">
					<SidebarLinks />
				</div>

				<footer className="sidebar-footer is-flex is-flex-direction-column is-align-items-center is-justify-content-center has-text-centered mb-5 mt-3">
					<div>
						© 2025 - {today.getFullYear()}
						<br />
						Rice & Stripes
					</div>
					<a
						target="_blank"
						rel="noreferrer"
						title="Страница проекта на Гитхабе"
						href="https://github.com/Nerevarinka/Rice-And-Stripes"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="currentColor"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
							className="sidebar-gh-icon"
							style={{ color: '#181717' }}
						>
							<path d={siGithub.path} />
						</svg>
					</a>
				</footer>
				</div>
			</aside>
		</>
	);
}

