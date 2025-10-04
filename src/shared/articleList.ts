import anatomyCover from "@app/assets/pages/articles/anatomy/cover.jpg";
import cageSelectionCover from "@app/assets/pages/articles/cageSelection/cover.jpg";

/** Данные о статьях */ // TODO: model
export const articles = [
    {
        caption: "Некоторые аспекты анатомии и физиологии птиц, которые стоит знать владельцу",
        link: "/articles/useful/anatomy",
        cover: anatomyCover,
        description: "Как птицы дышат на выдохе, почему их нельзя долго держать в руке и как они держатся на жердочках - обо всем этом и многом другом можно узнать в нашей новой статье. Мы постарались включить в нее только самое важное и практичное, и, конечно, снабдили текст наглядными картинками.",
        publishDate: new Date(2025, 3, 24),
    },
    {
        caption: "Выбор клетки для амадин – головная боль владельца",
        link: "/articles/useful/cageSelection",
        cover: cageSelectionCover,
        description: "На что обратить внимание при выборе жилища для птиц.",
        publishDate: new Date(2025, 1, 12)
    },
];
