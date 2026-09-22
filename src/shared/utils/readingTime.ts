import type {
    EditableArticleBlock,
    EditableArticleMessageMedia,
} from "@/models/editableArticle";

const WORDS_PER_MINUTE = 200;

function htmlToText(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/&[a-z]+;|&#\d+;/gi, " ");
}

function optionalHtmlToText(value: string | undefined) {
    return value ? htmlToText(value) : "";
}

function getMediaText(media: EditableArticleMessageMedia) {
    switch (media.type) {
        case "image":
            return [media.caption, media.spoiler].map(optionalHtmlToText).join(" ");
        case "imageCarousel":
            return media.images.map(image => optionalHtmlToText(image.caption)).join(" ");
        case "video":
            return [media.title, media.caption, media.spoiler].map(optionalHtmlToText).join(" ");
    }
}

function getBlockText(block: EditableArticleBlock) {
    switch (block.type) {
        case "richText":
            return htmlToText(block.html);
        case "heading":
            return block.text;
        case "image":
            return [block.caption, block.spoiler].map(optionalHtmlToText).join(" ");
        case "imageCarousel":
            return block.images.map(image => optionalHtmlToText(image.caption)).join(" ");
        case "video":
            return [block.title, block.caption, block.spoiler].map(optionalHtmlToText).join(" ");
        case "message": {
            const contentText = block.content?.map(content =>
                content.type === "richText" ? htmlToText(content.html) : getMediaText(content)
            );
            const legacyMedia = block.content?.length
                ? []
                : [...(block.media ?? []), ...(block.videos ?? [])].map(getMediaText);

            return [
                block.title,
                ...(block.content?.length ? contentText ?? [] : [htmlToText(block.bodyHtml)]),
                ...legacyMedia,
            ].filter(Boolean).join(" ");
        }
        case "spoiler":
            return [block.summary, htmlToText(block.bodyHtml)].join(" ");
        case "noteEmbed":
            return "";
        case "quiz":
            return [
                block.intro ?? "",
                ...block.questions.flatMap(question => [
                    question.text,
                    ...question.options.map(option => option.text),
                ]),
                ...(block.tieBreaker ? [
                    block.tieBreaker.text,
                    ...block.tieBreaker.options.map(option => option.text),
                ] : []),
                ...block.results.flatMap(result => [result.title, result.description]),
            ].join(" ");
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
