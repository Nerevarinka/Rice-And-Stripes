const legacyArticleRedirects = {
    cageSelection: "/articles/cage-selection",
    iodineObsession: "/articles/iodine-obsession",
    letFinchesFly: "/articles/letting-finches-fly",
    lightPartOne: "/articles/bird-and-light-part-one",
    nailBeakTrimming: "/articles/nail-beak-trimming",
    seedsWithFungi: "/articles/seeds-with-fungi",
    sproutingSeedMix: "/articles/safer-healthier-bird-seed",
    tamedFinches: "/articles/taming-finches",
    topTenMistakes: "/articles/top-10-beginner-mistakes",
    "uv-bird-adaptation": "/articles/bird-and-light-part-two",
    vinegarSwill: "/articles/vinegar-swill",
    "vitamin-d": "/articles/bird-and-light-part-three",
    zebraFinchesNatureDiet: "/articles/zebra-finches-natural-diet",
} as const;

export const legacyArticleSlugs = Object.keys(legacyArticleRedirects);

export function getLegacyArticleRedirect(slug: string) {
    return legacyArticleRedirects[slug as keyof typeof legacyArticleRedirects] ?? null;
}
