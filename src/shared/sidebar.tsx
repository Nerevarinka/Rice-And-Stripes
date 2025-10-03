import type { SidebarItem } from "@app/models";

import Home from "@app/pages/home";
import OurFinches from "@app/pages/ourFinches";

import ArticlesModule from "@app/pages/articles";
import CageSelection from "@app/pages/articles/components/cageSelection";
import UsefulArticles from "@app/pages/articles/components/useful";

import NotesModule from "@app/pages/notes";
import AnatomiyaIFiziologiya from "@app/pages/articles/components/anatomiya-i-fiziologiya";

/** Список элементов меню сайдбара */
export const sideBarMenu: Array<SidebarItem> = [
    {
        link: "",
        component: <Home />,
        caption: "",
        isGroup: false,
        visible: false,
    },
    {
        caption: "Статьи",
        link: "/articles",
        isGroup: true,
        visible: true,
        component: <ArticlesModule />,
    },
    {
        visible: true,
        isGroup: false,
        caption: "Полезные",
        link: "/articles/useful",
        component: <UsefulArticles />,
    },
    {
        caption: "Познавательные",
        link: "/articles/educational", // TODO
        isGroup: false,
        visible: true,
        component: <></>,
    },
    {
        isGroup: true,
        visible: true,
        caption: "Заметки",
        component: <NotesModule />,
        link: "/notes",
    },
    {
        isGroup: false,
        visible: false,
        caption: "",
        component: <CageSelection />,
        link: "/articles/useful/cageSelection",
    },
    {
        isGroup: false,
        visible: false,
        caption: "",
        component: <AnatomiyaIFiziologiya />,
        link: "/articles/useful/anatomiya-i-fiziologiya",
    },
    {
        isGroup: true,
        visible: true,
        link: "/our-band",
        caption: "Наши амадинки",
        component: <OurFinches />,
    }
];
