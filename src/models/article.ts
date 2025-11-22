import { StaticImport } from "next/dist/shared/lib/get-img-props";

/** Доступные теги для статей */
export type ArticleTag = 
    | "питание"
    | "познавательное"
    | "содержание"
    | "здоровье";

/** Цвета для тегов статей */
export const ArticleTagColors: Record<ArticleTag, { background: string; text: string }> = {
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

/** Тип для элемента статьи */
export type Article = {
    /** Заголовок статьи */
    caption: string;

    /** Ссылка на статью */
    link: string;

    /** Обложка статьи */
    cover: StaticImport;

    /** Описание статьи */
    description: string;

    /** Дата публикации */
    publishDate: Date;

    /** Теги статьи */
    tags: ArticleTag[];
};
