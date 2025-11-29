import { Article } from "@/models";

import { articleInfo as anatomy } from "@/app/(pages)/articles/anatomy/metadata";
import { articleInfo as cageSelection } from "@/app/(pages)/articles/cageSelection/metadata";
import { articleInfo as letFinchesFly } from "@/app/(pages)/articles/letFinchesFly/metadata";
import { articleInfo as topTenMistakes } from "@/app/(pages)/articles/topTenMistakes/metadata";
import { articleInfo as zebraFinchesNatureDiet } from "@/app/(pages)/articles/zebraFinchesNatureDiet/metadata";
import { articleInfo as tamedFinches } from "@/app/(pages)/articles/tamedFinches/metadata";
import { articleInfo as nailBeakTrimming } from "@/app/(pages)/articles/nailBeakTrimming/metadata";
import { articleInfo as vinegarSwill } from "@/app/(pages)/articles/vinegarSwill/metadata";
import { articleInfo as iodineObsession } from "@/app/(pages)/articles/iodineObsession/metadata";

/** Данные о статьях */
export const articles: Array<Article> = [
    anatomy,
    cageSelection,
    letFinchesFly,
    topTenMistakes,
    zebraFinchesNatureDiet,
    tamedFinches,
    nailBeakTrimming,
    vinegarSwill,
    iodineObsession,
].toSorted((x, y) => x.publishDate.getTime() - y.publishDate.getTime());
