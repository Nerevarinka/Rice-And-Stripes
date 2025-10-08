/** Тип для элемента статьи */
export type Article = {
    /** Заголовок статьи */
    caption: string;

    /** Ссылка на статью */
    link: string;

    /** Обложка статьи */
    cover: string;

    /** Описание статьи */
    description: string;

    /** Дата публикации */
    publishDate: Date;
};
