declare module "sanitize-html" {
    type SimpleTransformOptions = {
        [key: string]: string;
    };

    type SanitizeHtmlOptions = {
        allowedTags?: string[];
        allowedAttributes?: Record<string, string[]>;
        allowedSchemes?: string[];
        transformTags?: Record<string,
            | {
                tagName: string;
                attribs?: SimpleTransformOptions;
                text?: string;
            }
            | ((tagName: string, attribs: SimpleTransformOptions) => {
                tagName: string;
                attribs?: SimpleTransformOptions;
                text?: string;
            })
        >;
    };

    export function simpleTransform(
        tagName: string,
        attribs?: SimpleTransformOptions,
        merge?: boolean
    ): (tagName: string, attribs: SimpleTransformOptions) => {
        tagName: string;
        attribs?: SimpleTransformOptions;
        text?: string;
    };

    export default function sanitizeHtml(
        html: string,
        options?: SanitizeHtmlOptions
    ): string;
}
