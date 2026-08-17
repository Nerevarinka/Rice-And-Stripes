import type { MediaItemTag } from "./mediaItemTag";

export type EditableArticleStatus = "draft" | "published";

export type EditableArticleHeadingLevel = 2 | 3 | 4;

export type EditableArticleImageSize = "small" | "medium" | "big";

export type EditableArticleMessageVariant = "info" | "success" | "warning" | "dark" | "link" | "danger";

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

export type EditableArticleMessageMedia =
    | EditableArticleImageBlock
    | EditableArticleImageCarouselBlock
    | EditableArticleVideoBlock;

export type EditableArticleMessageText = {
    id: string;
    type: "richText";
    html: string;
};

export type EditableArticleMessageContent =
    | EditableArticleMessageText
    | EditableArticleMessageMedia;

export type EditableArticleMessageBlock = {
    id: string;
    type: "message";
    variant: EditableArticleMessageVariant;
    title?: string;
    collapsible?: boolean;
    defaultOpen?: boolean;
    content?: EditableArticleMessageContent[];
    /** @deprecated New message blocks store ordered text and media in content. */
    media?: EditableArticleMessageMedia[];
    /** @deprecated New message blocks store text fragments in content. */
    bodyHtml: string;
    /** @deprecated Older drafts stored nested videos separately. */
    videos?: EditableArticleVideoBlock[];
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
    contentType?: "article";
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
    redirectFrom?: string[];
};

export type EditableNote = Omit<EditableArticle, "contentType" | "tags"> & {
    contentType: "note";
};

export type EditableNoteRedirect = {
    schemaVersion: 2;
    contentType: "noteRedirect";
    slug: string;
    redirectTo: `/articles/${string}`;
    updatedAt: string;
};
