import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { MediaItemTag } from "./mediaItemTag";

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
    tags: MediaItemTag[];
};
