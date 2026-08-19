import { describe, expect, it } from "vitest";

import { normalizeExternalUrl } from "@/shared/utils/normalizeExternalUrl";
import { getVideoEmbedUrl } from "@/shared/utils/videoEmbedUrl";

describe("внешние ссылки", () => {
    it("добавляет https к домену без протокола", () => {
        expect(normalizeExternalUrl("stock.adobe.com/images/example"))
            .toBe("https://stock.adobe.com/images/example");
    });

    it("не меняет относительные ссылки и явно заданные схемы", () => {
        expect(normalizeExternalUrl("/articles/example")).toBe("/articles/example");
        expect(normalizeExternalUrl("mailto:author@example.com")).toBe("mailto:author@example.com");
    });
});

describe("встраивание видео", () => {
    it("преобразует ссылки VK и vk.ru в iframe", () => {
        expect(getVideoEmbedUrl("vk", "https://vk.ru/video-229064209_456239104"))
            .toBe("https://vk.com/video_ext.php?oid=-229064209&id=456239104&hd=2");
        expect(getVideoEmbedUrl("vk", "https://vk.com/clip-175830251_456239312"))
            .toBe("https://vk.com/video_ext.php?oid=-175830251&id=456239312&hd=2");
    });

    it("преобразует короткую ссылку YouTube", () => {
        expect(getVideoEmbedUrl("youtube", "https://youtu.be/dQw4w9WgXcQ"))
            .toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("отклоняет ссылку неподходящего провайдера", () => {
        expect(getVideoEmbedUrl("vk", "https://example.com/video-1_2")).toBe("");
    });
});
