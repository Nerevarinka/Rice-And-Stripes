import type { TableOfContentsItem } from "@/components/tableOfContents";
import type { EditableArticleBlock } from "@/models/editableArticle";

const HEADING_PATTERN = /<h([234])\s+[^>]*id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi;

export function extractTocItemsFromHtml(html: string): TableOfContentsItem[] {
    const items: TableOfContentsItem[] = [];
    let match: RegExpExecArray | null = null;

    while ((match = HEADING_PATTERN.exec(html)) !== null) {
        const level = Number(match[1]) as 2 | 3 | 4;
        const caption = match[3].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

        if (!caption) {
            continue;
        }

        items.push({
            caption,
            elementId: match[2],
            level,
        });
    }

    return items;
}

export function createTocItemsFromBlocks(blocks: EditableArticleBlock[]): TableOfContentsItem[] {
    return blocks
        .filter(block => block.type === "heading" && block.text.trim())
        .map(block => ({
            caption: block.type === "heading" ? block.text.trim() : "",
            elementId: block.id,
            level: block.type === "heading" ? block.level : 2,
        }));
}
