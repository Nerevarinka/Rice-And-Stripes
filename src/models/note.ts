import { MediaItemTag } from "./mediaItemTag";
import type { StaticImageData } from "next/image";

/** Тип для элемента заметки */
export type Note = {
    /** Заголовок заметки (опционально) */
    caption?: string;

    /** Ссылка на заметку */
    link: string;

    /** Описание заметки */
    description: string;

    /** Необязательное изображение для карточки */
    image?: StaticImageData | string;

    /** Описание изображения для экранных дикторов */
    imageAlt?: string;

    /** Дата публикации */
    publishDate: Date;

    /** Дата последнего редактирования */
    updatedAt?: Date;

    /** Теги заметки */
    tags: MediaItemTag[];
};
