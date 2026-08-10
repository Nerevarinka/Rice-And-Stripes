export type SearchItem = {
    title: string;
    description: string;
    link: string;
    kind: "Статья" | "Заметка" | "Раздел";
    searchText: string;
};
