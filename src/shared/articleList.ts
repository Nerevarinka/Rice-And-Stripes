import type { Article } from "@app/models";
import type { FC } from "react";

import { anatomy } from "@app/pages/articles/components/anatomy/article";
import { cageSelection } from "@app/pages/articles/components/cageSelection/article";
import { topTenMistakes } from "@app/pages/articles/components/topTenMistakes/article";
import { letFinchesFly } from "@app/pages/articles/components/letFinchesFly/article";
import { zebraFinchesNatureDiet } from "@app/pages/articles/components/zebraFinchesNatureDiet/article";

import Anatomy from "@app/pages/articles/components/anatomy";
import CageSelection from "@app/pages/articles/components/cageSelection";
import TopTenMistakes from "@app/pages/articles/components/topTenMistakes";
import LetFinchesFly from "@app/pages/articles/components/letFinchesFly";
import ZebraFinchesNatureDiet from "@app/pages/articles/components/zebraFinchesNatureDiet";

/** Данные о статьях */
export const articles: Array<Article> = [
    anatomy,
    cageSelection,
    topTenMistakes,
    letFinchesFly,
    zebraFinchesNatureDiet
];

/** Словарь сопоставления статей к компонентам для отображения */
export const articleComponents: Record<string, FC> = {
    [anatomy.link]: Anatomy,
    [cageSelection.link]: CageSelection,
    [topTenMistakes.link]: TopTenMistakes,
    [letFinchesFly.link]: LetFinchesFly,
    [zebraFinchesNatureDiet.link]: ZebraFinchesNatureDiet,

};
