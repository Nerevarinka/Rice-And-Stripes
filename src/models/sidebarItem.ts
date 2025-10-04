/** Элемент меню сайдбара */
export type SidebarItem = {
    /** Заголовок */
    caption: string;

    /** Ссылка */
    link: string;

    /** Является группой */
    isGroup: boolean;

    /** Компонент для отображения */
    component: React.ReactNode;

    /** Отображать в меню */
    visible: boolean;
};
