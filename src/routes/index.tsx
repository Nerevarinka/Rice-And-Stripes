import Home from "./home";

import OurFinches from "./ourFinches";

import ArticlesModule from "./articles";
import UsefulArticles from "./articles/components/useful";
import AnatomiyaIFiziologiya from "./articles/components/anatomiya-i-fiziologiya";
import CageSelection from "./articles/components/cageSelection";

import NotesModule from "./notes";

export const routes: Array<{
    link: string,
    component: React.ReactNode;
}> = [
        {
            link: "",
            component: <Home />,
        },
        {
            link: "/our-band",
            component: <OurFinches />,
        },
        {
            link: "/articles",
            component: <ArticlesModule />,
        },
        {
            link: "/articles/useful",
            component: <UsefulArticles />,
        },
        {
            link: "/articles/useful/anatomiya-i-fiziologiya",
            component: <AnatomiyaIFiziologiya />,
        },
        {
            link: "/articles/useful/cageSelection",
            component: <CageSelection />,
        },

        {
            link: "/notes",
            component: <NotesModule />,
        },
    ];
