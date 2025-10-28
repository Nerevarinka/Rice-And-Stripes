import type { Article } from "@app/models";

import topTenMistakesCover from "@app/assets/pages/articles/topTenMistakes/cover.jpg";

/** Данные о статье "Топ-10 раздражающих ошибок новичков" */
export const topTenMistakes: Article = {
    caption: "Топ-10 раздражающих ошибок новичков",
    link: "/articles/useful/top-ten-mistakes",
    cover: topTenMistakesCover,
    description: "Что неправильно делают начинающие владельцы и как это исправить.",
    publishDate: new Date(2025, 3, 1)
};