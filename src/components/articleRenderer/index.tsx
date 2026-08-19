import sanitizeHtml from "sanitize-html";

import EmbeddedVideo from "@/components/embeddedVideo";
import EmbeddedNote from "@/components/embeddedNote";
import ImageCarousel from "@/components/imageCarousel";
import ImageWithCaption from "@/components/imageWithCaption";
import VideoWithCaption from "@/components/videoWithCaption";
import { normalizeEditableArticleAssetUrl } from "@/shared/editableArticles";
import { sanitizeInlineHtml } from "@/shared/utils/sanitizeInlineHtml";
import { getVideoEmbedUrl } from "@/shared/utils/videoEmbedUrl";
import { normalizeExternalUrl } from "@/shared/utils/normalizeExternalUrl";
import { withBasePathIfInternal } from "@/shared/utils/withBasePath";

import type { EditableArticleBlock, EditableArticleMessageContent, EditableArticleMessageMedia, EditableArticleVideoBlock, EmbeddedNoteSummary } from "@/models/editableArticle";

type ArticleRendererProps = {
    blocks: EditableArticleBlock[];
    embeddedNotes?: EmbeddedNoteSummary[];
};

function FormattedCaption({ html }: { html?: string }) {
    if (!html) return null;
    return <span dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(html) }} />;
}

function VideoBlockView({ block }: { block: EditableArticleVideoBlock }) {
    if (block.kind !== "file") {
        const embedUrl = getVideoEmbedUrl(block.kind, block.src);
        return embedUrl ? (
            <EmbeddedVideo
                src={embedUrl}
                caption={<FormattedCaption html={block.caption} />}
                source={block.source}
                title={block.title}
                size={block.size}
                spoiler={block.spoilerEnabled === false ? undefined : block.spoiler}
                troubleshooting={block.kind === "vk" || block.kind === "rutube" ? {
                    provider: block.kind === "vk" ? "VK" : "RUTUBE",
                    originalUrl: block.src,
                } : undefined}
            />
        ) : null;
    }

    return (
        <VideoWithCaption
            src={normalizeEditableArticleAssetUrl(block.src)}
            caption={<FormattedCaption html={block.caption} />}
            source={block.source}
            size={block.size}
            spoiler={block.spoilerEnabled === false ? undefined : block.spoiler}
            type={block.mimeType ?? "video/mp4"}
            gifLike={block.gifLike}
        />
    );
}

function MessageMediaView({ media }: { media: EditableArticleMessageMedia }) {
    if (media.type === "video") return <VideoBlockView block={media} />;
    if (media.type === "imageCarousel") {
        return <ImageCarousel images={media.images.map(image => ({
            src: normalizeEditableArticleAssetUrl(image.imageUrl),
            alt: image.alt,
            caption: image.caption ? <FormattedCaption html={image.caption} /> : undefined,
            source: image.source,
        }))} />;
    }
    return <ImageWithCaption
        image={normalizeEditableArticleAssetUrl(media.imageUrl)}
        alt={media.alt}
        caption={<>{media.caption ? <FormattedCaption html={media.caption} /> : null}{media.source ? <>{media.caption ? <br /> : null}<a href={normalizeExternalUrl(media.source)} target="_blank" rel="noopener noreferrer" className="source-link">Источник</a></> : null}</>}
        size={media.size}
        spoiler={media.spoiler}
        expandable={media.expandable}
    />;
}

function MessageContentView({ content }: { content: EditableArticleMessageContent }) {
    if (content.type === "richText") {
        return <div dangerouslySetInnerHTML={{ __html: cleanHtml(content.html) }} />;
    }
    return <MessageMediaView media={content} />;
}

function getMessageContent(block: Extract<EditableArticleBlock, { type: "message" }>): EditableArticleMessageContent[] {
    return block.content ?? [
        { id: `${block.id}-legacy-text`, type: "richText", html: block.bodyHtml || "" },
        ...(block.media ?? block.videos ?? []),
    ];
}

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
            span: ["data-display-heading"],
            td: ["data-text-align"],
            th: ["data-text-align"],
            "*": ["class", "id"],
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
        transformTags: {
            a: (_tagName, attributes) => ({
                tagName: "a",
                attribs: {
                    ...attributes,
                    href: withBasePathIfInternal(attributes.href ?? ""),
                },
            }),
        },
    });
}

export default function ArticleRenderer({ blocks, embeddedNotes = [] }: ArticleRendererProps) {
    const notesBySlug = new Map(embeddedNotes.map(note => [note.slug, note]));

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
                            <Tag key={block.id} id={block.id} className={`title is-${block.level + 1}`}>
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
                                        <FormattedCaption html={block.caption} />
                                        {block.source ? (
                                            <>
                                                {block.caption ? <br /> : null}
                                                <a href={normalizeExternalUrl(block.source)} target="_blank" rel="noopener noreferrer" className="source-link">
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
                                    caption: image.caption ? <FormattedCaption html={image.caption} /> : undefined,
                                    source: image.source,
                                }))}
                            />
                        );
                    case "video":
                        return <VideoBlockView key={block.id} block={block} />;
                    case "message":
                        if (block.collapsible) {
                            return (
                                <details key={block.id} className={`message is-${block.variant} article-accordion`} open={block.defaultOpen}>
                                    <summary className="message-header">{block.title?.trim() || "Подробнее"}</summary>
                                    <div className="message-body">
                                        {getMessageContent(block).map(content => <MessageContentView key={content.id} content={content} />)}
                                    </div>
                                </details>
                            );
                        }
                        return (
                            <article key={block.id} className={`message is-${block.variant}`}>
                                {block.title?.trim() ? <div className="message-header">{block.title}</div> : null}
                                <div className="message-body">
                                    {getMessageContent(block).map(content => <MessageContentView key={content.id} content={content} />)}
                                </div>
                            </article>
                        );
                    case "spoiler":
                        return (
                            <details key={block.id} className="mt-5 box article-accordion" open={block.defaultOpen}>
                                <summary>{block.summary}</summary>
                                <div className="content mt-4" dangerouslySetInnerHTML={{ __html: cleanHtml(block.bodyHtml) }} />
                            </details>
                        );
                    case "noteEmbed": {
                        const note = notesBySlug.get(block.noteSlug);
                        return note ? <EmbeddedNote key={block.id} note={note} /> : (
                            <aside key={block.id} className="notification is-warning is-light">
                                Встроенная заметка «{block.noteSlug}» не найдена.
                            </aside>
                        );
                    }
                    default:
                        return null;
                }
            })}
        </>
    );
}
