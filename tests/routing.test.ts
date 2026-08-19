import { access } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { getLegacyArticleRedirect, legacyArticleSlugs } from "@/shared/legacyArticleRedirects";
import { siteConfig } from "@/shared/siteConfig";
import { withBasePathIfInternal } from "@/shared/utils/withBasePath";

describe("внутренние ссылки", () => {
    it("добавляет basePath к относительному адресу публикации", () => {
        expect(withBasePathIfInternal("/articles/seeds-with-fungi"))
            .toBe("/Rice-And-Stripes/articles/seeds-with-fungi");
    });

    it("исправляет абсолютный адрес сайта без basePath", () => {
        expect(withBasePathIfInternal(`${siteConfig.origin}/notes/red-eyed-finches`))
            .toBe(`${siteConfig.origin}/Rice-And-Stripes/notes/red-eyed-finches`);
    });

    it("не меняет внешний и уже нормализованный адрес", () => {
        expect(withBasePathIfInternal("https://example.com/articles/test")).toBe("https://example.com/articles/test");
        expect(withBasePathIfInternal("/Rice-And-Stripes/articles/test")).toBe("/Rice-And-Stripes/articles/test");
    });
});

describe("старые адреса статей", () => {
    it("у каждого alias есть существующая статья-назначение", async () => {
        expect(new Set(legacyArticleSlugs).size).toBe(legacyArticleSlugs.length);

        await Promise.all(legacyArticleSlugs.map(async legacySlug => {
            const redirectTo = getLegacyArticleRedirect(legacySlug);
            expect(redirectTo).toMatch(/^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*$/);

            const targetSlug = redirectTo?.split("/").at(-1);
            await expect(access(path.join(process.cwd(), "data", "articles", `${targetSlug}.json`)))
                .resolves.toBeUndefined();
        }));
    });
});
