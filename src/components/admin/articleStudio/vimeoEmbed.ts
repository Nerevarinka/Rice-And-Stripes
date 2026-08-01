import { Node, mergeAttributes } from "@tiptap/core";

export const VimeoEmbed = Node.create({
    name: "vimeoEmbed",

    group: "block",
    atom: true,
    draggable: true,
    selectable: true,

    addAttributes() {
        return {
            src: {
                default: "",
            },
            title: {
                default: "Vimeo video",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'iframe[src*="player.vimeo.com"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "iframe",
            mergeAttributes(HTMLAttributes, {
                allow: "autoplay; fullscreen; picture-in-picture",
                allowfullscreen: "true",
                referrerpolicy: "strict-origin-when-cross-origin",
            }),
        ];
    },
});
