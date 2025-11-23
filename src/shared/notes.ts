import { Note } from "@/models";

/** Данные о заметках */
export const notes: Array<Note> = [
    {
        caption: "Первая линька птенцов",
        link: "/notes/first-molt",
        description: "Важные моменты, на которые стоит обратить внимание во время первой линьки у молодых амадин",
        publishDate: new Date(2025, 10, 15),
        tags: ["здоровье", "познавательное"]
    },
    {
        link: "/notes/water-quality",
        description: "Какую воду давать птицам: кипяченую, фильтрованную или бутилированную?",
        publishDate: new Date(2025, 10, 20),
        tags: ["содержание"]
    },
    {
        caption: "Температурный режим",
        link: "/notes/temperature",
        description: "Оптимальная температура содержания амадин в квартире в разные времена года",
        publishDate: new Date(2025, 10, 10),
        tags: ["содержание", "здоровье"]
    },
    {
        link: "/notes/egg-food",
        description: "Рецепт яичной смеси для периода гнездования и кормления птенцов",
        publishDate: new Date(2025, 9, 25),
        tags: ["питание"]
    },
    {
        caption: "Ночное освещение",
        link: "/notes/night-light",
        description: "Нужен ли ночник в комнате с птицами и какой свет выбрать",
        publishDate: new Date(2025, 10, 5),
        tags: ["содержание"]
    },
    {
        link: "/notes/mineral-supplements",
        description: "Минеральные добавки: сепия, мел, ракушечник - что давать и в каких количествах",
        publishDate: new Date(2025, 9, 18),
        tags: ["питание", "здоровье"]
    }
];
