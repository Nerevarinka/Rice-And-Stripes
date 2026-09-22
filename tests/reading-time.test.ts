import { describe, expect, it } from "vitest";

import type { EditableArticleBlock } from "@/models/editableArticle";
import { calculateReadingTimeMinutes } from "@/shared/utils/readingTime";

const words = (count: number) => Array.from({ length: count }, (_, index) => `слово${index}`).join(" ");

describe("время чтения", () => {
    it("учитывает большие подписи к обычным медиа-блокам", () => {
        const blocks: EditableArticleBlock[] = [{
            id: "image",
            type: "image",
            imageUrl: "/image.webp",
            alt: "",
            caption: words(201),
            size: "medium",
        }];

        expect(calculateReadingTimeMinutes(blocks)).toBe(2);
    });

    it("учитывает подписи к медиа внутри message-блока", () => {
        const blocks: EditableArticleBlock[] = [{
            id: "message",
            type: "message",
            variant: "info",
            bodyHtml: "",
            content: [{
                id: "carousel",
                type: "imageCarousel",
                images: [{
                    imageUrl: "/image.webp",
                    alt: "",
                    caption: `<em>${words(201)}</em>`,
                }],
            }],
        }];

        expect(calculateReadingTimeMinutes(blocks)).toBe(2);
    });
});
