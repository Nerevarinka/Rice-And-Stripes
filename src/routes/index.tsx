import Home from "./home";
import OurFinches from "./our_finches";
import Useful from "./useful";
import AnatomiyaIFiziologiya from "./useful/anatomiya-i-fiziologiya";
import VyborKletki from "./useful/vybor-kletki";

export const routes = [{
    link: "",
    component: <Home />
}, {
    link: "/our-band",
    component: <OurFinches />
}, {
    link: "/useful",
    component: <Useful />
}, {
    link: "/useful/anatomiya-i-fiziologiya",
    component: <AnatomiyaIFiziologiya />
}, {
    link: "/useful/vybor-kletki",
    component: <VyborKletki />
},];