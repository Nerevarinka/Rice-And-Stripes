import { Metadata } from "next";

import { createCommonMetadata } from "@/shared/metadata";

export const metadata: Metadata = createCommonMetadata(
    "Заметки",
    "Мысли, наблюдения и маленькие советы. Заметка может со временем перерасти в статью.",
    ["заметки", "птицы", "поведение", "среда обитания", "очерки", "мысли"]
); // TODO:
