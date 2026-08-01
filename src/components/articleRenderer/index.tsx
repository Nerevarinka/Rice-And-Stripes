import sanitizeHtml from "sanitize-html";

import ImageCarousel from "@/components/imageCarousel";
import ImageWithCaption from "@/components/imageWithCaption";
import VideoWithCaption from "@/components/videoWithCaption";
import { normalizeEditableArticleAssetUrl } from "@/shared/editableArticles";
import { getVideoEmbedUrl } from "@/shared/utils/videoEmbedUrl";

import type { EditableArticleBlock } from "@/models/editableArticle";

type ArticleRendererProps = {
    blocks: EditableArticleBlock[];
};

function cleanHtml(html: string) {
    return sanitizeHtml(html, {
        allowedTags: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "u",
            "s",
            "del",
            "span",
            "code",
            "pre",
            "blockquote",
            "ul",
            "ol",
            "li",
            "a",
            "h2",
            "h3",
            "h4",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
            "hr",
            "sup",
            "sub",
            "mark",
        ],
        allowedAttributes: {
            a: ["href", "target", "rel"],
            td: ["data-text-align"],
            th: ["data-text-align"],
            "*": ["class", "id"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
    });
}

function EmbeddedVideo({ src, caption, source, title, size }: { src: string; caption: string; source?: string; title?: string; size: "small" | "medium" | "big"; }) {
    return (
        <div className={`embedded-video embedded-video--${size}`}>
            <iframe
                src={src}
                title={title ?? caption ?? "Видео"}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
            <div className="video-with-caption__caption">
                {caption}
                {source ? (
                    <>
                        {caption ? <br /> : null}
                        <a href={source} target="_blank" rel="noopener noreferrer" className="source-link">
                            Оригинал
                        </a>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default function ArticleRenderer({ blocks }: ArticleRendererProps) {
    return (
        <>
            {blocks.map(block => {
                switch (block.type) {
                    case "richText":
                        return (
                            <div
                                key={block.id}
                                className="content article-block article-block--richtext"
                                dangerouslySetInnerHTML={{ __html: cleanHtml(block.html) }}
                            />
                        );
                    case "heading": {
                        const Tag = `h${block.level}` as "h2" | "h3" | "h4";
                        return (
                            <Tag key={block.id} id={block.id} className={`title is-${block.level}`}>
                                {block.text}
                            </Tag>
                        );
                    }
                    case "image":
                        return (
                            <ImageWithCaption
                                key={block.id}
                                image={normalizeEditableArticleAssetUrl(block.imageUrl)}
                                alt={block.alt}
                                caption={
                                    <>
                                        {block.caption}
                                        {block.source ? (
                                            <>
                                                <br />
                                                <a href={block.source} target="_blank" rel="noopener noreferrer" className="source-link">
                                                    Источник
                                                </a>
                                            </>
                                        ) : null}
                                    </>
                                }
                                size={block.size}
                                spoiler={block.spoiler}
                                expandable={block.expandable}
                            />
                        );
                    case "imageCarousel":
                        return (
                            <ImageCarousel
                                key={block.id}
                                images={block.images.map(image => ({
                                    src: normalizeEditableArticleAssetUrl(image.imageUrl),
                                    alt: image.alt,
                                    caption: image.caption,
                                    source: image.source,
                                }))}
                            />
                        );
                    case "video":
                        if (block.kind !== "file") {
                            const embedUrl = getVideoEmbedUrl(block.kind, block.src);
                            return embedUrl ? (
                                <EmbeddedVideo
                                    key={block.id}
                                    src={embedUrl}
                                    caption={block.caption}
                                    source={block.source}
                                    title={block.title}
                                    size={block.size}
                                />
                            ) : null;
                        }

                        return (
                            <VideoWithCaption
                                key={block.id}
                                src={normalizeEditableArticleAssetUrl(block.src)}
                                caption={
                                    <>
                                        {block.caption}
                                        {block.source ? (
                                            <>
                                                <br />
                                                <a href={block.source} target="_blank" rel="noopener noreferrer" className="source-link">
                                                    Источник
                                                </a>
                                            </>
                                        ) : null}
                                    </>
                                }
                                size={block.size}
                                spoiler={block.spoiler}
                                type={block.mimeType ?? "video/mp4"}
                            />
                        );
                    case "message":
                        if (block.collapsible) {
                            return (
                                <details key={block.id} className={`message is-${block.variant} article-accordion`} open={block.defaultOpen}>
                                    <summary className="message-header">{block.title?.trim() || "Подробнее"}</summary>
                                    <div className="message-body" dangerouslySetInnerHTML={{ __html: cleanHtml(block.bodyHtml) }} />
                                </details>
                            );
                        }
                        return (
                            <article key={block.id} className={`message is-${block.variant}`}>
                                {block.title?.trim() ? <div className="message-header">{block.title}</div> : null}
                                <div className="message-body" dangerouslySetInnerHTML={{ __html: cleanHtml(block.bodyHtml) }} />
                            </article>
                        );
                    case "spoiler":
                        return (
                            <details key={block.id} className="mt-5 box article-accordion" open={block.defaultOpen}>
                                <summary>{block.summary}</summary>
                                <div className="content mt-4" dangerouslySetInnerHTML={{ __html: cleanHtml(block.bodyHtml) }} />
                            </details>
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}
