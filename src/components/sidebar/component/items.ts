import { SidebarItem } from "@/models";
import { articles } from "@/shared/articles";

/** Список элементов меню сайдбара */
export const sideBarMenu: Array<SidebarItem> = [
    {
        caption: "Статьи",
        link: "/articles",
        isGroup: true,
        children: articles.map(article => ({
            caption: article.caption,
            link: article.link,
        })),
    },
    {
        isGroup: true,
        caption: "Заметки",
        link: "/notes",
    },
    {
        isGroup: true,
        link: "/about",
        caption: "Наши амадинки",
    }
];
