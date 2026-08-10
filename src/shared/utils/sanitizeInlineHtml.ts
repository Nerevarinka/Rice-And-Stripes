import sanitizeHtml from "sanitize-html";
import { withBasePathIfInternal } from "@/shared/utils/withBasePath";

export function sanitizeInlineHtml(html: string) {
    return sanitizeHtml(html, {
        allowedTags: ["strong", "b", "em", "i", "s", "del", "br", "a", "span"],
        allowedAttributes: {
            a: ["href", "target", "rel"],
            span: ["data-caption-normal"],
        },
        allowedSchemes: ["http", "https", "mailto"],
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
