import { Metadata } from "next";

import { createCommonMetadata } from "@/shared/metadata";

export const metadata: Metadata = createCommonMetadata(
    "Заметки",
    "Небольшие заметки и мысли о птицах, их поведении и среде обитания и многом другом",
    ["заметки", "птицы", "поведение", "среда обитания", "очерки", "мысли"]
); // TODO:
