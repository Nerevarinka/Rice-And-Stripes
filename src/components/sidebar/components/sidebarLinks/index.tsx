import type { FC } from "react";
import { siTelegram, siVk } from "simple-icons";

/* Компонент ссылок сайдбара */
const SidebarLinks: FC = () => {
    return (
        <>
            <a
                target="_blank"
                rel="noreferrer"
                title="Телеграм-канал"
                href="https://t.me/rice_and_stripes"
                className="link-icon is-flex"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: '#26A5E4' }}
                >
                    <path d={siTelegram.path} />
                </svg>
            </a>

            <a
                target="_blank"
                rel="noreferrer"
                title="Группа ВКонтакте"
                href="https://vk.com/rice_and_stripes"
                className="link-icon is-flex"
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: '#0077FF' }}
                >
                    <path d={siVk.path} />
                </svg>
            </a>
        </>
    );
};

export default SidebarLinks;
