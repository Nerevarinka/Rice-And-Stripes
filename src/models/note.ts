import { MediaItemTag } from "./mediaItemTag";

/** Тип для элемента заметки */
export type Note = {
    /** Заголовок заметки (опционально) */
    caption?: string;

    /** Ссылка на заметку */
    link: string;

    /** Описание заметки */
    description: string;

    /** Дата публикации */
    publishDate: Date;

    /** Теги заметки */
    tags: MediaItemTag[];
};
