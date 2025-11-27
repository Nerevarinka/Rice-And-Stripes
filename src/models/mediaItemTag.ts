/** Доступные теги для статей и заметок */
export type MediaItemTag =
    | "питание"
    | "познавательное"
    | "содержание"
    | "здоровье";

/** Цвета для тегов статей и заметок */
export const MediaItemTagColors: Record<MediaItemTag, { background: string; text: string }> = {
    "питание": {
        background: "#48c78e",
        text: "#ffffff"
    },
    "познавательное": {
        background: "#3e8ed0",
        text: "#ffffff"
    },
    "содержание": {
        background: "#ffe08a",
        text: "#000000"
    },
    "здоровье": {
        background: "#f14668",
        text: "#ffffff"
    }
};
