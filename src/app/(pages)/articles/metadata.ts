import type { Metadata } from "next";

import { createCommonMetadata } from "@/shared/metadata";

export const metadata: Metadata = createCommonMetadata(
    "Статьи",
    "Полезные и познавательные статьи для владельцев амадин",
    [
        "Содержание амадин",
        "Зебровые амадины",
        "Рисовые амадины",
        "Японские амадины",
        "Гульдовы амадины",
        "Как содержать амадин",
        "Что можно давать амадинам",
        "Можно ли приручить амадин",
        "Чем питаются амадины",
        "Можно ли выпускать амадин полетать",
        "Уход за амадинами",
        "Болезни амадин",
        "Питание амадин",
        "Клетка для амадин",
        "Здоровье амадин",
    ]
);

metadata.robots = {
    index: true,
    follow: true,
    noimageindex: true,
    googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
};
