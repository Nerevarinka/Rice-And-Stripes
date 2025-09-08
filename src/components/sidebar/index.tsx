import type { FC } from "react";
import { Link } from "react-router";

import "./styles.scss";

const Sidebar: FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-wrapper">
                <div className="main-logo-container">
                    <img src=".\img\main_logo.png" className="sidebar-logo" title="Будто логотип кофейни" />
                </div>
                <div className="sidebar-header">
                    <Link
                        to="/"
                        className="sidebar-header-title"
                    >
                        Амадины<br />Rice & Stripes
                    </Link>
                    <div className="sidebar-header-description">Блог о птицах</div>
                </div>

                <hr className="sidebar-header-hr" />

                <div className="sidebar-body">
                    <div className="sidebar-body">
                        <nav className="sidebar-link-list">
                            <div className="sidebar-item">
                                <img src=".\img\zebra_finch_icon.webp" className="finch-hidden-icon" />
                                <a href="#" className="sidebar-link-group-text">Статьи</a>
                            </div>

                            <div className="sidebar-item">
                                <img src=".\img\zebra_finch_icon.webp" className="finch-hidden-icon" />
                                <a href="#" className="sidebar-link">Полезные</a>
                            </div>

                            <div className="sidebar-item">
                                <img src=".\img\zebra_finch_icon.webp" className="finch-hidden-icon" />
                                <a href="#" className="sidebar-link">Познавательные</a>
                            </div>

                            <div className="sidebar-item">
                                <img src=".\img\zebra_finch_icon.webp" className="finch-hidden-icon" />
                                <a href="#" className="sidebar-link-group-text">Заметки</a>
                            </div>

                            <div className="sidebar-item">
                                <img src=".\img\zebra_finch_icon.webp" className="finch-hidden-icon" />
                                <Link
                                    className="sidebar-link-group-text"
                                    to="/our-band"
                                >
                                    Наши амадинки
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>

                <div className="sidebar-links">
                    <a href="https://t.me/rice_and_stripes" target="_blank" title="Телеграм-канал">
                        <i className="bi bi-telegram sidebar-tg-icon"></i>
                    </a>

                    <span className="link-icon">
                        <img src=".\img\tg-Logo.svg" /> 
                    </span>

                    <span className="link-icon">
                        <a href="https://vk.com/rice_and_stripes" target="_blank" title="Группа ВКонтакте">
                            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="50" fill="#0077FF" />
                                <path d="M53.2083 72.042C30.4167 72.042 17.4168 56.417 16.8751 30.417H28.2917C28.6667 49.5003 37.0833 57.5836 43.7499 59.2503V30.417H54.5002V46.8752C61.0836 46.1669 67.9994 38.667 70.3328 30.417H81.0831C79.2914 40.5837 71.7914 48.0836 66.458 51.1669C71.7914 53.6669 80.3335 60.2086 83.5835 72.042H71.7498C69.2081 64.1253 62.8752 58.0003 54.5002 57.1669V72.042H53.2083Z"
                                    fill="#e8e2d7" className="icon-core" />
                            </svg>
                        </a>
                    </span>

                </div>

                <footer className="sidebar-footer">
                    © 2025 - Rice & Stripes
                    <a href="https://github.com/Nerevarinka/Rice-And-Stripes" target="_blank" title="Страница проекта на Гитхабе">
                        <i className="bi bi-github sidebar-gh-icon"></i>
                    </a>
                </footer>
            </div>
        </aside>

    );
};

export default Sidebar;