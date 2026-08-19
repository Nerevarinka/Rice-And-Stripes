import { withBasePath } from "./withBasePath";
import { getVideoEmbedUrl } from "./videoEmbedUrl";
import { sanitizeInlineHtml } from "./sanitizeInlineHtml";
import { normalizeExternalUrl } from "./normalizeExternalUrl";

import type {
    EditableArticleBlock,
    EditableArticleCarouselImage,
    EditableArticleHeadingBlock,
    EditableArticleImageBlock,
    EditableArticleImageCarouselBlock,
    EditableArticleMessageBlock,
    EditableArticleRichTextBlock,
    EditableArticleSpoilerBlock,
    EditableArticleVideoBlock,
} from "@/models/editableArticle";

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function normalizeUrl(url: string) {
    if (!url) {
        return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }

    if (url.startsWith("/Rice-And-Stripes/")) {
        return url;
    }

    if (url.startsWith("/")) {
        return withBasePath(url);
    }

    return withBasePath(`/${url}`);
}

function renderRichTextBlock(block: EditableArticleRichTextBlock) {
    return `<div class="content article-block article-block--richtext">${block.html}</div>`;
}

function renderHeadingBlock(block: EditableArticleHeadingBlock) {
    const tag = `h${block.level}`;
    const levelClass = `is-${block.level + 1}`;
    return `<${tag} id="${escapeHtml(block.id)}" class="title ${levelClass}">${escapeHtml(block.text)}</${tag}>`;
}

function renderImageBlock(block: EditableArticleImageBlock) {
    const src = normalizeUrl(block.imageUrl);
    const source = block.source ? `<br /><a href="${escapeHtml(normalizeExternalUrl(block.source))}" target="_blank" rel="noopener noreferrer" class="source-link">Источник</a>` : "";
    const spoiler = block.spoiler
        ? `<div class="image-with-caption__spoiler"><div class="image-with-caption__spoiler-content"><div class="image-with-caption__spoiler-text">${escapeHtml(block.spoiler)}</div></div></div>`
        : "";

    return `
        <figure class="image-with-caption image-with-caption--center">
            <div class="image-with-caption__image-wrapper image-with-caption__image-wrapper--${escapeHtml(block.size)}">
                <img src="${escapeHtml(src)}" alt="${escapeHtml(block.alt)}" class="image-with-caption__image image-with-caption__image--${escapeHtml(block.size)}" />
                ${spoiler}
            </div>
            <figcaption class="image-with-caption__caption">
                ${sanitizeInlineHtml(block.caption)}
                ${source}
            </figcaption>
        </figure>
    `;
}

function renderCarouselImage(image: EditableArticleCarouselImage) {
    const src = normalizeUrl(image.imageUrl);

    return {
        src,
        alt: image.alt,
        caption: image.caption,
        source: image.source,
    };
}

function renderCarouselBlock(block: EditableArticleImageCarouselBlock) {
    const images = block.images.map(renderCarouselImage);
    const first = images[0];

    if (!first) {
        return "";
    }

    const source = first.source ? `<br /><a href="${escapeHtml(normalizeExternalUrl(first.source))}" target="_blank" rel="noopener noreferrer" class="source-link">Источник</a>` : "";

    return `
        <div class="image-carousel">
            <figure class="image-carousel__content">
                <img src="${escapeHtml(first.src)}" alt="${escapeHtml(first.alt)}" class="image-carousel__image" />
                <figcaption class="image-carousel__caption">
                    ${first.caption ? sanitizeInlineHtml(first.caption) : ""}
                    ${source}
                </figcaption>
            </figure>
        </div>
    `;
}

function renderVideoBlock(block: EditableArticleVideoBlock) {
    const src = block.kind === "file" ? normalizeUrl(block.src) : getVideoEmbedUrl(block.kind, block.src);

    if (block.kind !== "file") {
        return `
            <div class="embedded-video embedded-video--${escapeHtml(block.size)}">
                <iframe
                    src="${escapeHtml(src)}"
                    title="${escapeHtml(block.title ?? block.caption ?? "Видео")}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
                <div class="video-with-caption__caption">
                    ${sanitizeInlineHtml(block.caption)}
                    ${block.source ? `${block.caption ? "<br />" : ""}<a href="${escapeHtml(normalizeExternalUrl(block.source))}" target="_blank" rel="noopener noreferrer" class="source-link">Оригинал</a>` : ""}
                </div>
            </div>
        `;
    }

    const source = block.source ? `${block.caption ? "<br />" : ""}<a href="${escapeHtml(normalizeExternalUrl(block.source))}" target="_blank" rel="noopener noreferrer" class="source-link">Оригинал</a>` : "";
    const videoAttributes = block.gifLike
        ? "autoplay loop muted playsinline preload=\"auto\""
        : "controls preload=\"metadata\"";

    return `
        <div class="video-with-caption video-with-caption--center${block.gifLike ? " video-with-caption--gif-like" : ""}">
            <div class="video-with-caption__video-wrapper video-with-caption__video-wrapper--${escapeHtml(block.size)}">
                <video class="video-with-caption__video video-with-caption__video--${escapeHtml(block.size)}" ${videoAttributes}>
                    <source src="${escapeHtml(src)}" type="${escapeHtml(block.mimeType ?? "video/mp4")}" />
                </video>
            </div>
            <div class="video-with-caption__caption">
                ${sanitizeInlineHtml(block.caption)}
                ${source}
            </div>
        </div>
    `;
}

function renderMessageBlock(block: EditableArticleMessageBlock) {
    const title = block.title?.trim()
        ? `<div class="message-header">${escapeHtml(block.title)}</div>`
        : "";
    const content = (block.content ?? [
        { id: `${block.id}-legacy-text`, type: "richText" as const, html: block.bodyHtml || "" },
        ...(block.media ?? block.videos ?? []),
    ]).map(item => {
        if (item.type === "richText") return `<div>${item.html}</div>`;
        if (item.type === "video") return renderVideoBlock(item);
        if (item.type === "imageCarousel") return renderCarouselBlock(item);
        return renderImageBlock(item);
    }).join("");

    if (block.collapsible) {
        return `
        <details class="message is-${escapeHtml(block.variant)} article-accordion"${block.defaultOpen ? " open" : ""}>
            <summary class="message-header">${escapeHtml(block.title?.trim() || "Подробнее")}</summary>
            <div class="message-body">${content}</div>
        </details>
        `;
    }

    return `
        <article class="message is-${escapeHtml(block.variant)}">
            ${title}
            <div class="message-body">${content}</div>
        </article>
    `;
}

function renderSpoilerBlock(block: EditableArticleSpoilerBlock) {
    return `
        <details class="mt-5 box article-accordion"${block.defaultOpen ? " open" : ""}>
            <summary>${escapeHtml(block.summary)}</summary>
            <div class="content mt-4">${block.bodyHtml}</div>
        </details>
    `;
}

export function serializeEditableArticleBlocksToHtml(blocks: EditableArticleBlock[]) {
    return blocks
        .map(block => {
            switch (block.type) {
                case "richText":
                    return renderRichTextBlock(block);
                case "heading":
                    return renderHeadingBlock(block);
                case "image":
                    return renderImageBlock(block);
                case "imageCarousel":
                    return renderCarouselBlock(block);
                case "video":
                    return renderVideoBlock(block);
                case "message":
                    return renderMessageBlock(block);
                case "spoiler":
                    return renderSpoilerBlock(block);
                case "noteEmbed":
                    return `<aside class="embedded-note"><a href="/notes/${escapeHtml(block.noteSlug)}">Открыть встроенную заметку</a></aside>`;
                default:
                    return "";
            }
        })
        .join("\n");
}
