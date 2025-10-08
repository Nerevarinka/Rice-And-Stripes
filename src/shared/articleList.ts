import type { Article } from "@app/models";
import type { FC } from "react";

import { anatomy } from "@app/pages/articles/components/anatomy/article";
import { cageSelection } from "@app/pages/articles/components/cageSelection/article";

import Anatomy from "@app/pages/articles/components/anatomy";
import CageSelection from "@app/pages/articles/components/cageSelection";

/** Данные о статьях */
export const articles: Array<Article> = [
    anatomy,
    cageSelection,
];

/** Словарь сопоставления статей к компонентам для отображения */
export const articleComponents: Record<string, FC> = {
    [anatomy.link]: Anatomy,
    [cageSelection.link]: CageSelection,
};
