import type { EditableArticleBlock } from "@/models/editableArticle";

const WORDS_PER_MINUTE = 200;

function htmlToText(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/&[a-z]+;|&#\d+;/gi, " ");
}

function getBlockText(block: EditableArticleBlock) {
    switch (block.type) {
        case "richText":
            return htmlToText(block.html);
        case "heading":
            return block.text;
        case "image":
            return [block.caption, block.spoiler].filter(Boolean).join(" ");
        case "imageCarousel":
            return block.images.map(image => image.caption ?? "").join(" ");
        case "video":
            return [block.title, block.caption, block.spoiler].filter(Boolean).join(" ");
        case "message":
            return [block.title, htmlToText(block.bodyHtml)].filter(Boolean).join(" ");
        case "spoiler":
            return [block.summary, htmlToText(block.bodyHtml)].join(" ");
        case "noteEmbed":
            return "";
        default:
            return "";
    }
}

export function calculateReadingTimeMinutes(blocks: EditableArticleBlock[]) {
    const words = blocks
        .map(getBlockText)
        .join(" ")
        .trim()
        .split(/\s+/u)
        .filter(Boolean).length;

    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function calculateReadingTimeFromWordCount(words: number) {
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number) {
    return `${minutes} мин чтения`;
}
