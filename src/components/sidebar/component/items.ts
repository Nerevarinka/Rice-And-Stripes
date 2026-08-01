import type { Article, SidebarItem } from "@/models";

export const buildSideBarMenu = (articles: Article[]): SidebarItem[] => [
    {
        caption: "Статьи",
        link: "/articles",
        isGroup: true,
        children: articles.map(article => ({
            caption: article.caption,
            link: article.link,
        })),
    },
];
