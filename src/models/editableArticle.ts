import type { MediaItemTag } from "./mediaItemTag";

export type EditableArticleStatus = "draft" | "published";

export type EditableArticleHeadingLevel = 2 | 3 | 4;

export type EditableArticleImageSize = "small" | "medium" | "big";

export type EditableArticleMessageVariant = "info" | "success" | "dark" | "link" | "danger";

export type EditableArticleVideoKind = "youtube" | "vk" | "rutube" | "vimeo" | "file";

export type EditableArticleTocItem = {
    caption: string;
    elementId: string;
    level?: EditableArticleHeadingLevel;
};

export type EditableArticleRichTextBlock = {
    id: string;
    type: "richText";
    html: string;
};

export type EditableArticleHeadingBlock = {
    id: string;
    type: "heading";
    level: EditableArticleHeadingLevel;
    text: string;
};

export type EditableArticleImageBlock = {
    id: string;
    type: "image";
    imageUrl: string;
    alt: string;
    caption: string;
    source?: string;
    size: EditableArticleImageSize;
    spoiler?: string;
    expandable?: boolean;
};

export type EditableArticleCarouselImage = {
    imageUrl: string;
    alt: string;
    caption?: string;
    source?: string;
};

export type EditableArticleImageCarouselBlock = {
    id: string;
    type: "imageCarousel";
    images: EditableArticleCarouselImage[];
};

export type EditableArticleVideoBlock = {
    id: string;
    type: "video";
    kind: EditableArticleVideoKind;
    src: string;
    caption: string;
    source?: string;
    size: EditableArticleImageSize;
    title?: string;
    spoiler?: string;
    spoilerEnabled?: boolean;
    mimeType?: string;
    gifLike?: boolean;
};

export type EditableArticleMessageBlock = {
    id: string;
    type: "message";
    variant: EditableArticleMessageVariant;
    title?: string;
    bodyHtml: string;
    collapsible?: boolean;
    defaultOpen?: boolean;
};

export type EditableArticleSpoilerBlock = {
    id: string;
    type: "spoiler";
    summary: string;
    bodyHtml: string;
    defaultOpen?: boolean;
};

export type EditableArticleBlock =
    | EditableArticleRichTextBlock
    | EditableArticleHeadingBlock
    | EditableArticleImageBlock
    | EditableArticleImageCarouselBlock
    | EditableArticleVideoBlock
    | EditableArticleMessageBlock
    | EditableArticleSpoilerBlock;

export type EditableArticle = {
    schemaVersion: 2;
    id: string;
    slug: string;
    title: string;
    description: string;
    coverUrl: string;
    publishDate: string;
    updatedAt: string;
    status: EditableArticleStatus;
    tags: MediaItemTag[];
    blocks: EditableArticleBlock[];
    html: string;
    tocItems?: EditableArticleTocItem[];
    readingTimeMinutes?: number;
};
