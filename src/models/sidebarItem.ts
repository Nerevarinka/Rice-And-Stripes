/** Элемент меню сайдбара */
export type SidebarItem = {
    /** Заголовок */
    caption: string;

    /** Ссылка */
    link: string;

    /** Является группой */
    isGroup: boolean;

    /** Вложенные элементы (для групп) */
    children?: Array<{ caption: string; link: string }>;
};
