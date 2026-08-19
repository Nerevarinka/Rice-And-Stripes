const SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;
const DOMAIN_PATTERN = /^(?:www\.)?(?:[a-z\d-]+\.)+[a-z]{2,}(?:[/:?#]|$)/i;

export function normalizeExternalUrl(value?: string) {
    const url = value?.trim() ?? "";

    if (!url || url.startsWith("/") || url.startsWith("#") || SCHEME_PATTERN.test(url)) {
        return url;
    }

    return DOMAIN_PATTERN.test(url) ? `https://${url}` : url;
}

function normalizeMediaSource<T extends EditableArticleMessageMedia>(media: T): T {
    if (media.type === "imageCarousel") {
        return {
            ...media,
            images: media.images.map(image => ({ ...image, source: normalizeExternalUrl(image.source) })),
        } as T;
    }

    return { ...media, source: normalizeExternalUrl(media.source) };
}

export function normalizeBlockExternalUrls(blocks: EditableArticleBlock[]) {
    return blocks.map(block => {
        if (block.type === "imageCarousel") {
            return {
                ...block,
                images: block.images.map(image => ({ ...image, source: normalizeExternalUrl(image.source) })),
            };
        }

        if (block.type === "image" || block.type === "video") {
            return { ...block, source: normalizeExternalUrl(block.source) };
        }

        if (block.type === "message") {
            return {
                ...block,
                content: block.content?.map(item => item.type === "richText" ? item : normalizeMediaSource(item)),
                media: block.media?.map(normalizeMediaSource),
                videos: block.videos?.map(video => ({ ...video, source: normalizeExternalUrl(video.source) })),
            };
        }

        return block;
    });
}
import type { EditableArticleBlock, EditableArticleMessageMedia } from "@/models/editableArticle";
