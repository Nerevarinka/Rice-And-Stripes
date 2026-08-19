"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Mark, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { CellSelection } from "@tiptap/pm/tables";
import { TextSelection } from "@tiptap/pm/state";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";
import {
    Bold,
    Code2,
    Copy,
    Eye,
    FileText,
    NotebookTabs,
    FolderOpen,
    CircleHelp,
    CalendarDays,
    ChevronDown,
    ChevronUp,
    ChevronsDown,
    ChevronsUp,
    FileJson2,
    Heading2,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    MessageSquareMore,
    Plus,
    RotateCcw,
    Save,
    Strikethrough,
    Underline,
    Trash2,
    Video,
    Table2,
    ArrowDown,
    ArrowUp,
    LayoutGrid,
    X,
} from "lucide-react";
import type {
    EditableArticle,
    EditableNote,
    EditableNoteRedirect,
    EditableArticleBlock,
    EditableArticleCarouselImage,
    EditableArticleHeadingBlock,
    EditableArticleHeadingLevel,
    EditableArticleImageBlock,
    EditableArticleImageCarouselBlock,
    EditableArticleImageSize,
    EditableArticleMessageBlock,
    EditableArticleMessageContent,
    EditableArticleMessageVariant,
    EditableArticleNoteEmbedBlock,
    EditableArticleRichTextBlock,
    EditableArticleSpoilerBlock,
    EditableArticleVideoBlock,
    EditableArticleVideoKind,
    EmbeddedNoteSummary,
} from "@/models/editableArticle";
import { MediaItemTagColors, type MediaItemTag } from "@/models/mediaItemTag";
import { createTocItemsFromBlocks } from "@/shared/utils/extractTocItemsFromHtml";
import { serializeEditableArticleBlocksToHtml } from "@/shared/utils/editableArticleHtml";
import { normalizeBlockExternalUrls } from "@/shared/utils/normalizeExternalUrl";
import { calculateReadingTimeMinutes, formatReadingTime } from "@/shared/utils/readingTime";
import { withBasePath } from "@/shared/utils/withBasePath";

import "./styles.scss";

const lowlight = createLowlight(common);

const DisplayHeading = Mark.create({
    name: "displayHeading",
    inclusive: false,
    addAttributes() {
        return {
            level: {
                default: 1,
                parseHTML: element => Number(element.getAttribute("data-display-heading")) || 1,
            },
        };
    },
    parseHTML() {
        return [{ tag: "span[data-display-heading]" }];
    },
    renderHTML({ HTMLAttributes }) {
        const { level, ...attributes } = HTMLAttributes;
        return ["span", mergeAttributes(attributes, {
            "data-display-heading": String(level ?? 1),
        }), 0];
    },
});

const CaptionNormal = Mark.create({
    name: "captionNormal",
    parseHTML() {
        return [{ tag: "span[data-caption-normal]" }];
    },
    renderHTML() {
        return ["span", { "data-caption-normal": "true" }, 0];
    },
});

const MAX_UPLOADED_IMAGE_SIDE = 1500;
let optimizeUploadedImages = true;
let activeEditorContentId = "";

const AlignableTableCell = TableCell.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            textAlign: {
                default: null,
                parseHTML: element => element.getAttribute("data-text-align"),
                renderHTML: attributes => attributes.textAlign
                    ? { "data-text-align": attributes.textAlign }
                    : {},
            },
        };
    },
});

const AlignableTableHeader = TableHeader.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            textAlign: {
                default: null,
                parseHTML: element => element.getAttribute("data-text-align"),
                renderHTML: attributes => attributes.textAlign
                    ? { "data-text-align": attributes.textAlign }
                    : {},
            },
        };
    },
});

const AVAILABLE_TAGS: MediaItemTag[] = [
    "питание",
    "познавательное",
    "содержание",
    "здоровье",
];

type SaveState = "idle" | "saving" | "saved" | "error";

type DirectoryPickerWindow = Window & {
    showDirectoryPicker?: (options?: { mode?: "read" | "readwrite" }) => Promise<FileSystemDirectoryHandle>;
};

type BlockPaletteType =
    | "richText"
    | "heading"
    | "image"
    | "video"
    | "imageCarousel"
    | "message"
    | "noteEmbed"
    | "spoiler";

type BlockPaletteState = {
    index: number | null;
};

async function writeTextFile(
    root: FileSystemDirectoryHandle,
    relativePath: string,
    content: string
) {
    const pathParts = relativePath.split("/").filter(Boolean);
    const fileName = pathParts.pop();

    if (!fileName) {
        throw new Error("Missing file name");
    }

    let currentDirectory = root;

    for (const directoryName of pathParts) {
        currentDirectory = await currentDirectory.getDirectoryHandle(directoryName, { create: true });
    }

    const fileHandle = await currentDirectory.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
}

async function writeBinaryFile(
    root: FileSystemDirectoryHandle,
    relativePath: string,
    file: File
) {
    const pathParts = relativePath.split("/").filter(Boolean);
    const fileName = pathParts.pop();

    if (!fileName) {
        throw new Error("Missing file name");
    }

    let currentDirectory = root;

    for (const directoryName of pathParts) {
        currentDirectory = await currentDirectory.getDirectoryHandle(directoryName, { create: true });
    }

    const fileHandle = await currentDirectory.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
}

function createId() {
    return crypto.randomUUID();
}

function getLocalDateInputValue(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function formatDateInputValue(value: string) {
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}.${month}.${year}` : "";
}

function parseDateInputValue(value: string) {
    const match = value.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) {
        return null;
    }

    const [, day, month, year] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const isValid = date.getFullYear() === Number(year)
        && date.getMonth() === Number(month) - 1
        && date.getDate() === Number(day);

    return isValid ? `${year}-${month}-${day}` : null;
}

function makeAssetPath(assetFolder: string, file: File) {
    return `/uploads/${assetFolder}/${file.name}`;
}

async function removeFileIfExists(
    root: FileSystemDirectoryHandle,
    relativePath: string
) {
    const pathParts = relativePath.split("/").filter(Boolean);
    const fileName = pathParts.pop();
    if (!fileName) return;

    try {
        let currentDirectory = root;
        for (const directoryName of pathParts) {
            currentDirectory = await currentDirectory.getDirectoryHandle(directoryName);
        }
        await currentDirectory.removeEntry(fileName);
    } catch (error) {
        if (error instanceof DOMException && error.name === "NotFoundError") return;
        throw error;
    }
}

async function readTextFileIfExists(
    root: FileSystemDirectoryHandle,
    relativePath: string
) {
    const pathParts = relativePath.split("/").filter(Boolean);
    const fileName = pathParts.pop();
    if (!fileName) return null;

    try {
        let currentDirectory = root;
        for (const directoryName of pathParts) {
            currentDirectory = await currentDirectory.getDirectoryHandle(directoryName);
        }
        const fileHandle = await currentDirectory.getFileHandle(fileName);
        return await (await fileHandle.getFile()).text();
    } catch (error) {
        if (error instanceof DOMException && error.name === "NotFoundError") return null;
        throw error;
    }
}

async function assertContentSlugAvailable(
    root: FileSystemDirectoryHandle,
    collectionName: string,
    slug: string,
    contentId: string
) {
    const relativePath = `data/${collectionName}/${slug}.json`;
    const existingText = await readTextFileIfExists(root, relativePath);
    if (!existingText) return;

    try {
        const existing = JSON.parse(existingText) as { id?: string };
        if (existing.id === contentId) return;
    } catch {
        // An unreadable existing file is still occupied and must not be replaced.
    }

    throw new Error(`Slug "${slug}" уже занят другим материалом. Выберите другой slug или откройте существующий JSON для редактирования.`);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
    return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));
}

function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
}

async function prepareImageForUpload(file: File) {
    const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!optimizeUploadedImages) {
        return {
            file,
            message: `Изображение сохранено без обработки: ${formatFileSize(file.size)}.`,
        };
    }
    if (!supportedTypes.has(file.type)) {
        return {
            file,
            message: `Формат ${file.type || file.name.split(".").pop() || "файла"} не обрабатывается: сохранён исходник ${formatFileSize(file.size)}.`,
        };
    }

    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        return {
            file,
            message: `Не удалось прочитать изображение: сохранён исходник ${formatFileSize(file.size)}.`,
        };
    }
    try {
        const originalWidth = bitmap.width;
        const originalHeight = bitmap.height;
        const scale = Math.min(1, MAX_UPLOADED_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
            return { file, message: `Обработка не применилась: сохранён исходник ${formatFileSize(file.size)}.` };
        }

        context.drawImage(bitmap, 0, 0, width, height);
        const blob = await canvasToBlob(canvas, "image/webp", 0.82);
        if (!blob) {
            return { file, message: `WebP не создан: сохранён исходник ${formatFileSize(file.size)}.` };
        }

        const wasResized = scale < 1;
        if (blob.size >= file.size) {
            return {
                file,
                message: `WebP получился не меньше (${formatFileSize(blob.size)}). Сохранён исходник ${formatFileSize(file.size)}, ${originalWidth}×${originalHeight} px.`,
            };
        }

        const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
        const optimizedFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: file.lastModified,
        });
        const dimensions = wasResized
            ? `, ${originalWidth}×${originalHeight} → ${width}×${height} px`
            : `, ${width}×${height} px`;
        return {
            file: optimizedFile,
            message: `Изображение оптимизировано: ${formatFileSize(file.size)} → ${formatFileSize(blob.size)}${dimensions}.`,
        };
    } finally {
        bitmap.close();
    }
}

function pickFile(accept: string) {
    return new Promise<File | null>(resolve => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.onchange = () => resolve(input.files?.[0] ?? null);
        input.click();
    });
}

function createEmptyRichTextBlock(): EditableArticleRichTextBlock {
    return { id: createId(), type: "richText", html: "<p></p>" };
}

function createEmptyHeadingBlock(level: EditableArticleHeadingLevel = 2): EditableArticleHeadingBlock {
    return { id: createId(), type: "heading", level, text: "" };
}

function createEmptyImageBlock(): EditableArticleImageBlock {
    return {
        id: createId(),
        type: "image",
        imageUrl: "",
        alt: "",
        caption: "",
        source: "",
        size: "medium",
        spoiler: "",
        expandable: true,
    };
}

function createEmptyVideoBlock(): EditableArticleVideoBlock {
    return {
        id: createId(),
        type: "video",
        kind: "vk",
        src: "",
        caption: "",
        source: "",
        size: "medium",
        title: "",
        spoiler: "",
        spoilerEnabled: false,
        gifLike: false,
    };
}

function createEmptyCarouselBlock(): EditableArticleImageCarouselBlock {
    return {
        id: createId(),
        type: "imageCarousel",
        images: [
            { imageUrl: "", alt: "", caption: "", source: "" },
        ],
    };
}

function createEmptyMessageBlock(): EditableArticleMessageBlock {
    const textBlock = createEmptyRichTextBlock();
    return {
        id: createId(),
        type: "message",
        variant: "info",
        title: "",
        bodyHtml: "",
        collapsible: false,
        defaultOpen: false,
        content: [textBlock],
    };
}

function createEmptySpoilerBlock(): EditableArticleSpoilerBlock {
    return {
        id: createId(),
        type: "spoiler",
        summary: "Подробнее",
        bodyHtml: "<p></p>",
        defaultOpen: false,
    };
}

function createEmptyNoteEmbedBlock(): EditableArticleNoteEmbedBlock {
    return { id: createId(), type: "noteEmbed", noteSlug: "" };
}

function createBlock(type: BlockPaletteType): EditableArticleBlock {
    switch (type) {
        case "richText":
            return createEmptyRichTextBlock();
        case "heading":
            return createEmptyHeadingBlock();
        case "image":
            return createEmptyImageBlock();
        case "video":
            return createEmptyVideoBlock();
        case "imageCarousel":
            return createEmptyCarouselBlock();
        case "message":
            return createEmptyMessageBlock();
        case "noteEmbed":
            return createEmptyNoteEmbedBlock();
        case "spoiler":
            return createEmptySpoilerBlock();
        default:
            return createEmptyRichTextBlock();
    }
}

function getBlockLabel(block: EditableArticleBlock) {
    switch (block.type) {
        case "richText":
            return "Текст";
        case "heading":
            return `Заголовок H${block.level}`;
        case "image":
            return "Изображение";
        case "video":
            return block.gifLike ? "Анимация как GIF" : block.kind === "file" ? "Видео-файл" : "Видео-ссылка";
        case "imageCarousel":
            return "Карусель";
        case "message":
            return `Сообщение (${block.variant})`;
        case "noteEmbed":
            return "Встроенная заметка";
        case "spoiler":
            return "Спойлер";
        default:
            return "Блок";
    }
}

async function uploadAssetUrl(
    repoRoot: FileSystemDirectoryHandle,
    assetFolder: string,
    file: File,
    onPrepared?: (message: string) => void
) {
    const [collectionName, slug] = assetFolder.split("/");
    if ((collectionName === "articles" || collectionName === "notes") && slug) {
        try {
            await assertContentSlugAvailable(repoRoot, collectionName, slug, activeEditorContentId);
        } catch (error) {
            onPrepared?.(error instanceof Error ? error.message : "Slug уже занят.");
            return null;
        }
    }

    const prepared = file.type.startsWith("image/")
        ? await prepareImageForUpload(file)
        : { file, message: "" };
    const preparedFile = prepared.file;
    const relativePath = `public/uploads/${assetFolder}/${preparedFile.name}`;
    await writeBinaryFile(repoRoot, relativePath, preparedFile);
    if (prepared.message) onPrepared?.(prepared.message);
    return makeAssetPath(assetFolder, preparedFile);
}

type RichTextEditorProps = {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
};

function RichTextEditor({ value, placeholder, onChange }: RichTextEditorProps) {
    const selectedTableCellsRef = useRef<{ anchor: number; head: number } | null>(null);
    const cleanTrailingEmptyParagraph = (html: string) => {
        let cleaned = html;
        let previous = "";

        while (cleaned !== previous) {
            previous = cleaned;
            cleaned = cleaned
                .replace(/<li><p>(?:\s|<br\s*\/?\s*>)*<\/p><\/li>(\s*<\/(?:ul|ol)>)/gi, "$1")
                .replace(/<p>(?:\s|<br\s*\/?\s*>)*<\/p>(?=\s*<\/(?:blockquote|div)>)/gi, "")
                .replace(/(?:<p>(?:\s|<br\s*\/?\s*>)*<\/p>)+$/gi, "");
        }

        return cleaned || "<p></p>";
    };

    const editor = useEditor({
        immediatelyRender: false,
        enableInputRules: false,
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
            }),
            DisplayHeading,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
            }),
            Table.configure({ resizable: true }),
            TableRow,
            AlignableTableHeader,
            AlignableTableCell,
            CodeBlockLowlight.configure({ lowlight }),
            Placeholder.configure({
                placeholder: placeholder ?? "Начните писать...",
            }),
        ],
        content: value,
        onSelectionUpdate: ({ editor: currentEditor }) => {
            const { selection } = currentEditor.state;
            if (selection instanceof CellSelection) {
                selectedTableCellsRef.current = {
                    anchor: selection.$anchorCell.pos,
                    head: selection.$headCell.pos,
                };
            }
        },
        onUpdate: ({ editor: currentEditor }) => onChange(cleanTrailingEmptyParagraph(currentEditor.getHTML())),
        onBlur: ({ editor: currentEditor }) => {
            const html = currentEditor.getHTML();
            const cleanedHtml = cleanTrailingEmptyParagraph(html);
            if (cleanedHtml !== html) {
                currentEditor.commands.setContent(cleanedHtml, { emitUpdate: false });
                onChange(cleanedHtml);
            }
        },
    });

    if (!editor) {
        return null;
    }

    const toggleLink = () => {
        const selection = {
            from: editor.state.selection.from,
            to: editor.state.selection.to,
        };
        const currentHref = editor.getAttributes("link").href ?? "";
        const href = window.prompt("Адрес ссылки (оставьте пустым, чтобы удалить)", currentHref);
        if (href === null) return;

        if (!href.trim()) {
            editor.chain().focus().setTextSelection(selection).extendMarkRange("link").unsetLink().unsetUnderline().run();
            return;
        }

        editor.chain().focus().setTextSelection(selection).extendMarkRange("link").setLink({ href: href.trim() }).run();
    };

    const addTable = () => editor.chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .command(({ tr, state }) => {
            const { $from } = tr.selection;
            let tableDepth = $from.depth;
            while (tableDepth > 0 && $from.node(tableDepth).type.name !== "table") tableDepth -= 1;
            if (tableDepth === 0) return true;

            const tablePosition = $from.before(tableDepth);
            const tableNode = tr.doc.nodeAt(tablePosition);
            if (!tableNode) return true;

            const afterTable = tablePosition + tableNode.nodeSize;
            const followingNode = tr.doc.nodeAt(afterTable);
            if (!followingNode || followingNode.type.name !== "paragraph") {
                tr.insert(afterTable, state.schema.nodes.paragraph.create());
            }
            tr.setSelection(TextSelection.near(tr.doc.resolve(afterTable + 1)));
            return true;
        })
        .run();
    const hasTable = editor.getHTML().includes("<table");
    const setCellAlignment = (textAlign: "left" | "center") => {
        const currentSelection = editor.state.selection;
        const savedSelection = selectedTableCellsRef.current;

        if (currentSelection instanceof CellSelection || savedSelection) {
            const cellSelection = currentSelection instanceof CellSelection
                ? currentSelection
                : CellSelection.create(editor.state.doc, savedSelection!.anchor, savedSelection!.head);
            const transaction = editor.state.tr.setSelection(cellSelection);

            cellSelection.forEachCell((cell, position) => {
                transaction.setNodeMarkup(position, undefined, {
                    ...cell.attrs,
                    textAlign,
                });
            });

            editor.view.dispatch(transaction);
            editor.view.focus();
            return;
        }

        editor.chain().focus().setCellAttribute("textAlign", textAlign).run();
    };

    const toggleDisplayHeading = (level: 1 | 2 | 3) => {
        const isActive = editor.isActive("displayHeading", { level });
        const chain = editor.chain().focus().unsetMark("displayHeading");
        if (!isActive) chain.setMark("displayHeading", { level });
        chain.run();
    };

    const tableActions = [
        { label: "Столбец слева", action: () => editor.chain().focus().addColumnBefore().run() },
        { label: "Столбец справа", action: () => editor.chain().focus().addColumnAfter().run() },
        { label: "Строка сверху", action: () => editor.chain().focus().addRowBefore().run() },
        { label: "Строка снизу", action: () => editor.chain().focus().addRowAfter().run() },
        { label: "Удалить столбец", action: () => editor.chain().focus().deleteColumn().run() },
        { label: "Удалить строку", action: () => editor.chain().focus().deleteRow().run() },
        { label: "Удалить таблицу", action: () => editor.chain().focus().deleteTable().run() },
        { label: "Текст слева", action: () => setCellAlignment("left") },
        { label: "Текст по центру", action: () => setCellAlignment("center") },
    ];

    return (
        <div className="article-studio__editor-shell">
            <div className="article-studio__toolbar" onMouseDown={event => event.preventDefault()}>
                <button type="button" className={`button is-small ${editor.isActive("bold") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Жирный" title="Жирный">
                    <Bold size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("italic") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Курсив" title="Курсив">
                    <Italic size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("strike") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleStrike().run()} aria-label="Зачёркнутый текст" title="Зачёркнутый текст">
                    <Strikethrough size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("underline") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleUnderline().run()} aria-label="Подчёркнутый текст" title="Подчёркнутый текст">
                    <Underline size={16} />
                </button>
                {([1, 2, 3] as const).map(level => (
                    <button
                        key={level}
                        type="button"
                        className={`button is-small ${editor.isActive("displayHeading", { level }) ? "is-link" : "is-light"}`}
                        onMouseDown={event => event.preventDefault()}
                        onClick={() => toggleDisplayHeading(level)}
                        aria-label={`Визуальный заголовок H${level}`}
                        title={`H${level}: крупный текст без добавления в оглавление`}
                    >H{level}</button>
                ))}
                <button type="button" className={`button is-small ${editor.isActive("bulletList") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Маркированный список" title="Маркированный список">
                    <List size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("orderedList") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Нумерованный список" title="Нумерованный список">
                    <ListOrdered size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("codeBlock") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()} aria-label="Блок кода" title="Блок кода">
                    <Code2 size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("link") ? "is-link" : "is-light"}`} onClick={toggleLink} aria-label="Добавить ссылку" title="Добавить ссылку">
                    <Link2 size={16} />
                </button>
                <button type="button" className="button is-small is-light" onClick={addTable} aria-label="Вставить таблицу" title="Вставить таблицу">
                    <Table2 size={16} />
                </button>
            </div>

            {hasTable ? (
                <div className="article-studio__table-actions">
                    {/* Actions intentionally close over the current editor selection. */}
                    {/* eslint-disable-next-line react-hooks/refs */}
                    {tableActions.map(item => (
                        <button key={item.label} type="button" className="button is-small is-light" onMouseDown={event => event.preventDefault()} onClick={item.action}>
                            {item.label}
                        </button>
                    ))}
                </div>
            ) : null}

            <div className="article-studio__editor">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

function InlineTextEditor({ value, onChange, defaultItalic = false }: { value: string; onChange: (html: string) => void; defaultItalic?: boolean }) {
    const editor = useEditor({
        enableInputRules: false,
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                blockquote: false,
                codeBlock: false,
                horizontalRule: false,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    target: "_blank",
                    rel: "noopener noreferrer",
                },
            }),
            CaptionNormal,
        ],
        content: value || "<p></p>",
        immediatelyRender: false,
        onUpdate: ({ editor: currentEditor }) => {
            const html = currentEditor.getHTML()
                .replace(/^<p>/, "")
                .replace(/<\/p>$/, "")
                .replace(/<\/p><p>/g, "<br>");
            onChange(html === "<br>" ? "" : html);
        },
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML()
            .replace(/^<p>/, "")
            .replace(/<\/p>$/, "")
            .replace(/<\/p><p>/g, "<br>");
        if (current !== value) editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }, [editor, value]);

    if (!editor) return null;

    const toggleLink = () => {
        const selection = {
            from: editor.state.selection.from,
            to: editor.state.selection.to,
        };
        const currentHref = editor.getAttributes("link").href ?? "";
        const href = window.prompt("Адрес ссылки (оставьте пустым, чтобы удалить)", currentHref);
        if (href === null) return;

        if (!href.trim()) {
            editor.chain().focus().setTextSelection(selection).extendMarkRange("link").unsetLink().unsetUnderline().run();
            return;
        }

        editor.chain().focus().setTextSelection(selection).extendMarkRange("link").setLink({ href: href.trim() }).run();
    };

    const toggleItalic = () => {
        if (!defaultItalic) {
            editor.chain().focus().toggleItalic().run();
            return;
        }

        const chain = editor.chain().focus();
        if (editor.isActive("captionNormal")) {
            chain.unsetMark("captionNormal").run();
        } else {
            chain.unsetMark("italic").setMark("captionNormal").run();
        }
    };

    return (
        <div className={`article-studio__inline-editor${defaultItalic ? " article-studio__inline-editor--caption" : ""}`}>
            <div className="article-studio__inline-toolbar" onMouseDown={event => event.preventDefault()}>
                <button type="button" className={`button is-small ${editor.isActive("bold") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleBold().run()} title="Жирный" aria-label="Жирный"><Bold size={15} /></button>
                <button type="button" className={`button is-small ${(defaultItalic ? !editor.isActive("captionNormal") : editor.isActive("italic")) ? "is-link" : "is-light"}`} onClick={toggleItalic} title="Курсив" aria-label="Курсив"><Italic size={15} /></button>
                <button type="button" className={`button is-small ${editor.isActive("strike") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleStrike().run()} title="Зачёркнуто" aria-label="Зачёркнуто"><Strikethrough size={15} /></button>
                <button type="button" className={`button is-small ${editor.isActive("underline") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Подчёркнуто" aria-label="Подчёркнуто"><Underline size={15} /></button>
                <button type="button" className={`button is-small ${editor.isActive("link") ? "is-link" : "is-light"}`} onClick={toggleLink} title="Добавить или изменить ссылку" aria-label="Добавить или изменить ссылку"><Link2 size={15} /></button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}

function NestedVideoEditor({
    video,
    repoRoot,
    assetFolder,
    onChange,
    onDelete,
    setStatusMessage,
}: {
    video: EditableArticleVideoBlock;
    repoRoot: FileSystemDirectoryHandle | null;
    assetFolder: string;
    onChange: (video: EditableArticleVideoBlock) => void;
    onDelete: () => void;
    setStatusMessage: (message: string) => void;
}) {
    const uploadVideo = async () => {
        if (!repoRoot || !assetFolder) {
            setStatusMessage("Сначала подключите папку проекта и заполните slug.");
            return;
        }
        const file = await pickFile("video/*");
        if (!file) return;
        const src = await uploadAssetUrl(repoRoot, assetFolder, file, setStatusMessage);
        if (!src) return;
        onChange({ ...video, src, mimeType: file.type || "video/mp4" });
    };

    return (
        <div className="article-studio__nested-video">
            <div className="article-studio__nested-video-header">
                <strong>Видео в заметке</strong>
                <button type="button" className="button is-small is-light" onClick={onDelete} title="Удалить видео" aria-label="Удалить видео"><Trash2 size={15} /></button>
            </div>
            <div className="columns is-multiline">
                <div className="column is-half">
                    <label className="label">Тип</label>
                    <div className="select is-fullwidth"><select value={video.kind} onChange={event => onChange({ ...video, kind: event.target.value as EditableArticleVideoKind })}>
                        <option value="vk">VK Видео</option><option value="youtube">YouTube</option><option value="rutube">RUTUBE</option><option value="vimeo">Vimeo</option><option value="file">Локальный файл</option>
                    </select></div>
                </div>
                <div className="column is-half">
                    <label className="label">Размер</label>
                    <div className="select is-fullwidth"><select value={video.size} onChange={event => onChange({ ...video, size: event.target.value as EditableArticleImageSize })}>
                        <option value="small">small</option><option value="medium">medium</option><option value="big">big</option>
                    </select></div>
                </div>
                <div className="column is-full">
                    <label className="label">{video.kind === "file" ? "Путь к видеофайлу" : "Ссылка на видео"}</label>
                    <div className="field is-grouped"><p className="control is-expanded"><input className="input" value={video.src} onChange={event => onChange({ ...video, src: event.target.value })} /></p>
                    {video.kind === "file" ? <p className="control"><button type="button" className="button is-light" onClick={uploadVideo}><Video size={16} /><span>Загрузить</span></button></p> : null}</div>
                </div>
                <div className="column is-full"><label className="label">Подпись</label><InlineTextEditor value={video.caption} onChange={caption => onChange({ ...video, caption })} defaultItalic /></div>
                <div className="column is-half"><label className="label">Название для доступности</label><input className="input" value={video.title ?? ""} onChange={event => onChange({ ...video, title: event.target.value })} /></div>
                <div className="column is-half"><label className="label">Оригинал / источник</label><input className="input" value={video.source ?? ""} onChange={event => onChange({ ...video, source: event.target.value })} /></div>
                {video.kind === "file" ? <div className="column is-full"><label className="checkbox"><input type="checkbox" checked={video.gifLike ?? false} onChange={event => onChange({ ...video, gifLike: event.target.checked })} /><span className="ml-2">Воспроизводить как GIF</span></label></div> : null}
                <div className="column is-full">
                    <label className="checkbox"><input type="checkbox" checked={video.spoilerEnabled ?? Boolean(video.spoiler)} onChange={event => onChange({ ...video, spoilerEnabled: event.target.checked })} /><span className="ml-2">Скрыть видео под спойлером</span></label>
                    {(video.spoilerEnabled ?? Boolean(video.spoiler)) ? <div className="mt-3"><label className="label">Текст предупреждения</label><input className="input" value={video.spoiler ?? ""} onChange={event => onChange({ ...video, spoiler: event.target.value })} /></div> : null}
                </div>
            </div>
        </div>
    );
}

function NestedImageEditor({ image, repoRoot, assetFolder, onChange, onDelete, setStatusMessage }: {
    image: EditableArticleImageBlock;
    repoRoot: FileSystemDirectoryHandle | null;
    assetFolder: string;
    onChange: (image: EditableArticleImageBlock) => void;
    onDelete: () => void;
    setStatusMessage: (message: string) => void;
}) {
    const [uploadMessage, setUploadMessage] = useState("");
    const upload = async () => {
        if (!repoRoot || !assetFolder) {
            setStatusMessage("Сначала подключите папку проекта и заполните slug.");
            return;
        }
        const file = await pickFile("image/*");
        if (!file) return;
        const imageUrl = await uploadAssetUrl(repoRoot, assetFolder, file, setUploadMessage);
        if (!imageUrl) return;
        onChange({ ...image, imageUrl });
    };

    return (
        <div className="article-studio__nested-media">
            <div className="article-studio__nested-video-header"><strong>Изображение в заметке</strong><button type="button" className="button is-small is-light" onClick={onDelete} title="Удалить" aria-label="Удалить"><Trash2 size={15} /></button></div>
            {image.imageUrl ? <div className="article-studio__nested-image-preview"><img src={withBasePath(image.imageUrl)} alt={image.alt || ""} /></div> : null}
            {uploadMessage ? <p className="help mt-1">{uploadMessage}</p> : null}
            <div className="field is-grouped"><p className="control is-expanded"><input className="input" value={image.imageUrl} onChange={event => onChange({ ...image, imageUrl: event.target.value })} placeholder="/uploads/..." /></p><p className="control"><button type="button" className="button is-light" onClick={upload}><ImagePlus size={16} /><span>Загрузить</span></button></p></div>
            <div className="columns is-multiline">
                <div className="column is-half"><label className="label">Alt</label><input className="input" value={image.alt} onChange={event => onChange({ ...image, alt: event.target.value })} /></div>
                <div className="column is-half"><label className="label">Размер</label><div className="select is-fullwidth"><select value={image.size} onChange={event => onChange({ ...image, size: event.target.value as EditableArticleImageSize })}><option value="small">small</option><option value="medium">medium</option><option value="big">big</option></select></div></div>
                <div className="column is-full"><label className="label">Подпись</label><InlineTextEditor value={image.caption} onChange={caption => onChange({ ...image, caption })} defaultItalic /></div>
                <div className="column is-half"><label className="label">Источник</label><input className="input" value={image.source ?? ""} onChange={event => onChange({ ...image, source: event.target.value })} /></div>
                <div className="column is-half"><label className="label">Спойлер</label><input className="input" value={image.spoiler ?? ""} onChange={event => onChange({ ...image, spoiler: event.target.value })} /></div>
            </div>
        </div>
    );
}

function NestedCarouselEditor({ carousel, repoRoot, assetFolder, onChange, onDelete, setStatusMessage }: {
    carousel: EditableArticleImageCarouselBlock;
    repoRoot: FileSystemDirectoryHandle | null;
    assetFolder: string;
    onChange: (carousel: EditableArticleImageCarouselBlock) => void;
    onDelete: () => void;
    setStatusMessage: (message: string) => void;
}) {
    const [uploadMessages, setUploadMessages] = useState<Record<number, string>>({});
    const upload = async (index: number) => {
        if (!repoRoot || !assetFolder) {
            setStatusMessage("Сначала подключите папку проекта и заполните slug.");
            return;
        }
        const file = await pickFile("image/*");
        if (!file) return;
        const imageUrl = await uploadAssetUrl(repoRoot, assetFolder, file, message => {
            setUploadMessages(current => ({ ...current, [index]: message }));
        });
        if (!imageUrl) return;
        const images = [...carousel.images];
        images[index] = { ...images[index], imageUrl };
        onChange({ ...carousel, images });
    };
    const updateImage = (index: number, nextImage: EditableArticleCarouselImage) => {
        const images = [...carousel.images];
        images[index] = nextImage;
        onChange({ ...carousel, images });
    };

    return (
        <div className="article-studio__nested-media">
            <div className="article-studio__nested-video-header"><strong>Карусель в заметке</strong><button type="button" className="button is-small is-light" onClick={onDelete} title="Удалить" aria-label="Удалить"><Trash2 size={15} /></button></div>
            {carousel.images.map((image, index) => <div className="article-studio__nested-carousel-item" key={`${carousel.id}-${index}`}>
                <div className="article-studio__nested-video-header"><strong>Картинка {index + 1}</strong><button type="button" className="button is-small is-light" disabled={carousel.images.length === 1} onClick={() => onChange({ ...carousel, images: carousel.images.filter((_, itemIndex) => itemIndex !== index) })} title="Удалить картинку" aria-label="Удалить картинку"><X size={14} /></button></div>
                {image.imageUrl ? <div className="article-studio__nested-image-preview"><img src={withBasePath(image.imageUrl)} alt={image.alt || ""} /></div> : null}
                {uploadMessages[index] ? <p className="help mt-1">{uploadMessages[index]}</p> : null}
                <div className="field is-grouped"><p className="control is-expanded"><input className="input" value={image.imageUrl} onChange={event => updateImage(index, { ...image, imageUrl: event.target.value })} /></p><p className="control"><button type="button" className="button is-light" onClick={() => upload(index)}><ImagePlus size={16} /><span>Загрузить</span></button></p></div>
                <div className="columns is-multiline"><div className="column is-half"><label className="label">Alt</label><input className="input" value={image.alt} onChange={event => updateImage(index, { ...image, alt: event.target.value })} /></div><div className="column is-half"><label className="label">Источник</label><input className="input" value={image.source ?? ""} onChange={event => updateImage(index, { ...image, source: event.target.value })} /></div><div className="column is-full"><label className="label">Подпись</label><InlineTextEditor value={image.caption ?? ""} onChange={caption => updateImage(index, { ...image, caption })} defaultItalic /></div></div>
            </div>)}
            <button type="button" className="button is-light article-studio__nested-carousel-add" onClick={() => onChange({ ...carousel, images: [...carousel.images, { imageUrl: "", alt: "", caption: "", source: "" }] })}><Plus size={16} /><span>Добавить картинку</span></button>
        </div>
    );
}

function NoteEmbedSelector({ notes, value, onChange }: {
    notes: EmbeddedNoteSummary[];
    value: string;
    onChange: (noteSlug: string) => void;
}) {
    const selectedNote = notes.find(note => note.slug === value);
    const [query, setQuery] = useState(selectedNote?.title ?? "");
    const [isOpen, setIsOpen] = useState(false);
    const sortedNotes = useMemo(
        () => [...notes].sort((left, right) => left.title.localeCompare(right.title, "ru", { sensitivity: "base" })),
        [notes]
    );
    const filteredNotes = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase("ru");
        return sortedNotes
            .filter(note => !normalizedQuery || note.title.toLocaleLowerCase("ru").includes(normalizedQuery))
            .slice(0, 12);
    }, [query, sortedNotes]);

    useEffect(() => {
        if (selectedNote) setQuery(selectedNote.title);
    }, [selectedNote?.title]);

    return (
        <div className="article-studio__note-search">
            <input
                className="input"
                type="search"
                value={query}
                placeholder="Начните вводить название заметки"
                autoComplete="off"
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
                onChange={event => {
                    setQuery(event.target.value);
                    setIsOpen(true);
                    if (value) onChange("");
                }}
                aria-label="Поиск заметки по названию"
                aria-expanded={isOpen}
            />
            {isOpen ? (
                <div className="article-studio__note-search-results" role="listbox" aria-label="Найденные заметки">
                    {filteredNotes.length ? filteredNotes.map(note => (
                        <button
                            key={note.slug}
                            type="button"
                            className={`article-studio__note-search-option${note.slug === value ? " is-selected" : ""}`}
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => {
                                onChange(note.slug);
                                setQuery(note.title);
                                setIsOpen(false);
                            }}
                            role="option"
                            aria-selected={note.slug === value}
                        >
                            <strong>{note.title}</strong>
                            <span>{formatDateInputValue(note.publishDate.slice(0, 10))}</span>
                        </button>
                    )) : <p className="article-studio__note-search-empty">Заметок с таким названием нет</p>}
                </div>
            ) : null}
        </div>
    );
}

type BlockCardProps = {
    block: EditableArticleBlock;
    notes: EmbeddedNoteSummary[];
    index: number;
    total: number;
    repoRoot: FileSystemDirectoryHandle | null;
    assetFolder: string;
    onChange: (block: EditableArticleBlock) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onMoveToTop: () => void;
    onMoveToBottom: () => void;
    onInsertBelow: () => void;
    setStatusMessage: (message: string) => void;
};

function BlockCard({
    block,
    notes,
    index,
    total,
    repoRoot,
    assetFolder,
    onChange,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onMoveToTop,
    onMoveToBottom,
    onInsertBelow,
    setStatusMessage,
}: BlockCardProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [imageUploadMessages, setImageUploadMessages] = useState<Record<string, string>>({});
    const messageContent: EditableArticleMessageContent[] = block.type === "message"
        ? block.content ?? [
            { id: `${block.id}-legacy-text`, type: "richText", html: block.bodyHtml || "<p></p>" },
            ...(block.media ?? block.videos ?? []),
        ]
        : [];
    const setMessageContent = (content: EditableArticleMessageContent[]) => {
        if (block.type === "message") {
            onChange({ ...block, content, bodyHtml: "", media: undefined, videos: undefined });
        }
    };
    const uploadImage = async (carouselImageIndex?: number) => {
        if (!repoRoot) {
            setStatusMessage("Сначала подключите папку репозитория, чтобы сохранить изображение в проект.");
            return;
        }

        if (!assetFolder) {
            setStatusMessage("Сначала заполните корректный slug: он станет именем папки для изображений.");
            return;
        }

        const file = await pickFile("image/*");
        if (!file || block.type !== "image" && block.type !== "imageCarousel") {
            return;
        }

        const messageKey = block.type === "image" ? "image" : String(carouselImageIndex);
        const imageUrl = await uploadAssetUrl(repoRoot, assetFolder, file, message => {
            setImageUploadMessages(current => ({ ...current, [messageKey]: message }));
        });
        if (!imageUrl) return;

        if (block.type === "image") {
            onChange({ ...block, imageUrl });
        } else {
            if (carouselImageIndex === undefined) {
                return;
            }

            const nextImages = [...block.images];
            const currentImage = nextImages[carouselImageIndex];
            nextImages[carouselImageIndex] = {
                ...currentImage,
                imageUrl,
                alt: currentImage.alt,
            };
            onChange({ ...block, images: nextImages });
        }
    };

    return (
        <section className={`article-studio__block article-studio__block--${block.type}${block.type === "message" ? ` article-studio__block--message-${block.variant}` : ""}`}>
            <div className="article-studio__block-header">
                <div className="article-studio__block-title">
                    <button
                        type="button"
                        className="button is-small is-light"
                        onClick={() => setIsCollapsed(current => !current)}
                        aria-label={isCollapsed ? "Развернуть блок" : "Свернуть блок"}
                        title={isCollapsed ? "Развернуть блок" : "Свернуть блок"}
                    >
                        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                    <span className="article-studio__block-type">{getBlockLabel(block)}</span>
                    <span className="article-studio__block-index">#{index + 1}</span>
                </div>

                <div className="article-studio__block-actions">
                    <button type="button" className="button is-small is-light" onClick={onMoveToTop} disabled={index === 0} aria-label="Переместить блок в самое начало" title="Переместить блок в самое начало">
                        <ChevronsUp size={16} />
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onMoveUp} disabled={index === 0} aria-label="Переместить блок выше" title="Переместить блок выше">
                        <ArrowUp size={16} />
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onMoveDown} disabled={index === total - 1} aria-label="Переместить блок ниже" title="Переместить блок ниже">
                        <ArrowDown size={16} />
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onMoveToBottom} disabled={index === total - 1} aria-label="Переместить блок в самый конец" title="Переместить блок в самый конец">
                        <ChevronsDown size={16} />
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onDuplicate} aria-label="Дублировать блок" title="Дублировать блок">
                        <Copy size={16} />
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onInsertBelow} aria-label="Добавить блок ниже" title="Добавить блок ниже">
                        <Plus size={16} />
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onDelete} aria-label="Удалить блок" title="Удалить блок">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {!isCollapsed ? <div className="article-studio__block-body">
                {block.type === "richText" ? (
                    <RichTextEditor
                        value={block.html}
                        placeholder="Пишите текстовый блок..."
                        onChange={html => onChange({ ...block, html })}
                    />
                ) : null}

                {block.type === "heading" ? (
                    <div className="article-studio__block-form">
                        <div className="field">
                            <label className="label">Уровень</label>
                            <div className="select is-fullwidth">
                                <select
                                    value={block.level}
                                    onChange={event => onChange({ ...block, level: Number(event.target.value) as EditableArticleHeadingLevel })}
                                >
                                    <option value={2}>H2</option>
                                    <option value={3}>H3</option>
                                    <option value={4}>H4</option>
                                </select>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Текст заголовка</label>
                            <input className="input" value={block.text} onChange={event => onChange({ ...block, text: event.target.value })} />
                        </div>
                    </div>
                ) : null}

                {block.type === "noteEmbed" ? (
                    <div className="article-studio__block-form article-studio__note-embed-editor">
                        <div className="field">
                            <label className="label">Заметка</label>
                            <NoteEmbedSelector
                                notes={notes}
                                value={block.noteSlug}
                                onChange={noteSlug => onChange({ ...block, noteSlug })}
                            />
                            <p className="help">Карточка будет брать актуальные заголовок, описание, дату и обложку из оригинала.</p>
                        </div>
                        {(() => {
                            const note = notes.find(item => item.slug === block.noteSlug);
                            return note ? (
                                <div className="article-studio__note-embed-preview">
                                    <div>
                                        <span>Заметка · {formatDateInputValue(note.publishDate.slice(0, 10))}</span>
                                        <strong>{note.title}</strong>
                                        {note.description ? <p>{note.description}</p> : null}
                                    </div>
                                    {note.coverUrl ? <img src={withBasePath(note.coverUrl)} alt="" /> : null}
                                </div>
                            ) : null;
                        })()}
                    </div>
                ) : null}

                {block.type === "image" ? (
                    <div className="article-studio__block-form">
                        <div className={`article-studio__asset-preview article-studio__asset-preview--${block.size}${block.imageUrl ? "" : " article-studio__asset-preview--empty"}`}>
                            {block.imageUrl ? <img src={withBasePath(block.imageUrl)} alt={block.alt || block.caption || "preview"} /> : <div className="article-studio__asset-placeholder">Нет изображения</div>}
                        </div>
                        {imageUploadMessages.image ? <p className="help mt-1">{imageUploadMessages.image}</p> : null}
                        <div className="field is-grouped">
                            <p className="control is-expanded">
                                <input className="input" value={block.imageUrl} onChange={event => onChange({ ...block, imageUrl: event.target.value })} placeholder="/uploads/..." />
                            </p>
                            <p className="control">
                                <button type="button" className="button is-light" onClick={() => uploadImage()}>
                                    <ImagePlus size={16} />
                                    <span>Загрузить</span>
                                </button>
                            </p>
                        </div>
                        <div className="columns is-multiline">
                            <div className="column is-half">
                                <label className="label">Alt</label>
                                <input className="input" value={block.alt} onChange={event => onChange({ ...block, alt: event.target.value })} />
                            </div>
                            <div className="column is-half">
                                <label className="label">Размер</label>
                                <div className="select is-fullwidth">
                                    <select value={block.size} onChange={event => onChange({ ...block, size: event.target.value as EditableArticleImageSize })}>
                                        <option value="small">small</option>
                                        <option value="medium">medium</option>
                                        <option value="big">big</option>
                                    </select>
                                </div>
                            </div>
                            <div className="column is-full">
                                <label className="label">Подпись</label>
                                <InlineTextEditor value={block.caption} onChange={caption => onChange({ ...block, caption })} defaultItalic />
                            </div>
                            <div className="column is-half">
                                <label className="label">Источник</label>
                                <input className="input" value={block.source ?? ""} onChange={event => onChange({ ...block, source: event.target.value })} />
                            </div>
                            <div className="column is-half">
                                <label className="label">Спойлер</label>
                                <input className="input" value={block.spoiler ?? ""} onChange={event => onChange({ ...block, spoiler: event.target.value })} />
                            </div>
                            <div className="column is-half">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={block.expandable ?? true}
                                        onChange={event => onChange({ ...block, expandable: event.target.checked })}
                                    />
                                    <span className="ml-2">Увеличение по клику</span>
                                </label>
                            </div>
                        </div>
                    </div>
                ) : null}

                {block.type === "video" ? (
                    <div className="article-studio__block-form">
                        <div className="columns is-multiline">
                            <div className="column is-half">
                                <label className="label">Тип</label>
                                <div className="select is-fullwidth">
                                    <select
                                        value={block.kind}
                                        onChange={event => onChange({ ...block, kind: event.target.value as EditableArticleVideoKind })}
                                    >
                                        <option value="vk">VK Видео</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="rutube">RUTUBE</option>
                                        <option value="vimeo">Vimeo</option>
                                        <option value="file">Локальный файл</option>
                                    </select>
                                </div>
                            </div>
                            <div className="column is-half">
                                <label className="label">Размер</label>
                                <div className="select is-fullwidth">
                                    <select value={block.size} onChange={event => onChange({ ...block, size: event.target.value as EditableArticleImageSize })}>
                                        <option value="small">small</option>
                                        <option value="medium">medium</option>
                                        <option value="big">big</option>
                                    </select>
                                </div>
                            </div>
                            {block.kind === "file" ? (
                                <div className="column is-full">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={block.gifLike ?? false}
                                            onChange={event => onChange({ ...block, gifLike: event.target.checked })}
                                        />
                                        <span className="ml-2">Воспроизводить как GIF: автозапуск, повтор и без звука</span>
                                    </label>
                                </div>
                            ) : null}
                            <div className="column is-full">
                                <label className="label">{block.kind === "file" ? "Путь к видеофайлу" : "Ссылка на видео"}</label>
                                <div className="field is-grouped">
                                    <p className="control is-expanded">
                                        <input className="input" value={block.src} onChange={event => onChange({ ...block, src: event.target.value })} placeholder={block.kind === "file" ? "/uploads/..." : block.kind === "vk" ? "https://vkvideo.ru/video-..._..." : block.kind === "rutube" ? "https://rutube.ru/video/..." : block.kind === "vimeo" ? "https://vimeo.com/..." : "https://www.youtube.com/watch?v=..."} />
                                    </p>
                                    {block.kind === "file" ? (
                                        <p className="control">
                                            <button
                                                type="button"
                                                className="button is-light"
                                                onClick={async () => {
                                                    if (!repoRoot) {
                                                        setStatusMessage("Сначала подключите папку репозитория, чтобы сохранить видео в проект.");
                                                        return;
                                                    }

                                                    if (!assetFolder) {
                                                        setStatusMessage("Сначала заполните корректный slug: он станет именем папки для видео.");
                                                        return;
                                                    }

                                                    const file = await pickFile("video/*");
                                                    if (!file) {
                                                        return;
                                                    }

                                                    const videoUrl = await uploadAssetUrl(repoRoot, assetFolder, file, setStatusMessage);
                                                    if (!videoUrl) return;
                                                    onChange({ ...block, src: videoUrl, mimeType: file.type || "video/mp4" });
                                                }}
                                            >
                                                <Video size={16} />
                                                <span>Загрузить</span>
                                            </button>
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                            <div className="column is-full">
                                <label className="label">Подпись</label>
                                <InlineTextEditor value={block.caption} onChange={caption => onChange({ ...block, caption })} defaultItalic />
                            </div>
                            <div className="column is-half">
                                <label className="label">Название видео для доступности</label>
                                <input className="input" value={block.title ?? ""} onChange={event => onChange({ ...block, title: event.target.value })} />
                                <p className="help">Необязательно. Коротко опишите видео для экранных дикторов; если оставить пустым, используется подпись.</p>
                            </div>
                            <div className="column is-half">
                                <label className="label">Оригинал / источник</label>
                                <input className="input" value={block.source ?? ""} onChange={event => onChange({ ...block, source: event.target.value })} />
                            </div>
                            <div className="column is-full">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={block.spoilerEnabled ?? Boolean(block.spoiler)}
                                        onChange={event => onChange({ ...block, spoilerEnabled: event.target.checked })}
                                    />
                                    <span className="ml-2">Скрыть видео под спойлером</span>
                                </label>
                                {(block.spoilerEnabled ?? Boolean(block.spoiler)) ? (
                                    <div className="mt-3">
                                        <label className="label">Текст предупреждения</label>
                                        <input
                                            className="input"
                                            value={block.spoiler ?? ""}
                                            onChange={event => onChange({ ...block, spoiler: event.target.value })}
                                            placeholder="Например: Сцены медицинских процедур"
                                        />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : null}

                {block.type === "imageCarousel" ? (
                    <div className="article-studio__block-form">
                        {block.images.map((image, imageIndex) => (
                            <div key={`${block.id}-${imageIndex}`} className="article-studio__carousel-item">
                                <div className="article-studio__carousel-item-header">
                                    <strong>Изображение {imageIndex + 1}</strong>
                                    <div className="article-studio__carousel-item-actions">
                                        <button
                                            type="button"
                                            className="button is-small is-light"
                                            disabled={imageIndex === 0}
                                            aria-label={`Переместить изображение ${imageIndex + 1} выше`}
                                            title="Переместить изображение выше"
                                            onClick={() => {
                                                const nextImages = [...block.images];
                                                [nextImages[imageIndex - 1], nextImages[imageIndex]] = [nextImages[imageIndex], nextImages[imageIndex - 1]];
                                                onChange({ ...block, images: nextImages });
                                            }}
                                        >
                                            <ArrowUp size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="button is-small is-light"
                                            disabled={imageIndex === block.images.length - 1}
                                            aria-label={`Переместить изображение ${imageIndex + 1} ниже`}
                                            title="Переместить изображение ниже"
                                            onClick={() => {
                                                const nextImages = [...block.images];
                                                [nextImages[imageIndex], nextImages[imageIndex + 1]] = [nextImages[imageIndex + 1], nextImages[imageIndex]];
                                                onChange({ ...block, images: nextImages });
                                            }}
                                        >
                                            <ArrowDown size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="button is-small is-light"
                                            aria-label={`Удалить изображение ${imageIndex + 1} из карусели`}
                                            title="Удалить изображение из карусели"
                                            disabled={block.images.length === 1}
                                            onClick={() =>
                                                onChange({
                                                    ...block,
                                                    images: block.images.filter((_, index) => index !== imageIndex),
                                                })
                                            }
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                                {image.imageUrl ? (
                                    <div className="article-studio__carousel-preview">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={withBasePath(image.imageUrl)}
                                            alt={image.alt || image.caption || `Изображение ${imageIndex + 1}`}
                                        />
                                    </div>
                                ) : null}
                                {imageUploadMessages[String(imageIndex)] ? (
                                    <p className="help mt-1">{imageUploadMessages[String(imageIndex)]}</p>
                                ) : null}
                                <div className="field">
                                    <label className="label">Путь к файлу</label>
                                    <div className="field is-grouped">
                                        <p className="control is-expanded">
                                            <input
                                                className="input"
                                                value={image.imageUrl}
                                                onChange={event => {
                                                    const nextImages = [...block.images];
                                                    nextImages[imageIndex] = { ...image, imageUrl: event.target.value };
                                                    onChange({ ...block, images: nextImages });
                                                }}
                                            />
                                        </p>
                                        <p className="control">
                                            <button type="button" className="button is-light" onClick={() => uploadImage(imageIndex)}>
                                                <ImagePlus size={16} />
                                                <span>Загрузить</span>
                                            </button>
                                        </p>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Alt</label>
                                    <input
                                        className="input"
                                        value={image.alt}
                                        onChange={event => {
                                            const nextImages = [...block.images];
                                            nextImages[imageIndex] = { ...image, alt: event.target.value };
                                            onChange({ ...block, images: nextImages });
                                        }}
                                    />
                                </div>
                                <div className="field">
                                    <label className="label">Подпись</label>
                                    <InlineTextEditor
                                        value={image.caption ?? ""}
                                        onChange={caption => {
                                            const nextImages = [...block.images];
                                            nextImages[imageIndex] = { ...image, caption };
                                            onChange({ ...block, images: nextImages });
                                        }}
                                        defaultItalic
                                    />
                                </div>
                                <div className="field">
                                    <label className="label">Источник</label>
                                    <input
                                        className="input"
                                        value={image.source ?? ""}
                                        onChange={event => {
                                            const nextImages = [...block.images];
                                            nextImages[imageIndex] = { ...image, source: event.target.value };
                                            onChange({ ...block, images: nextImages });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="article-studio__carousel-actions article-studio__carousel-actions--footer">
                            <button
                                type="button"
                                className="button is-light"
                                onClick={() => onChange({ ...block, images: [...block.images, { imageUrl: "", alt: "", caption: "", source: "" }] })}
                            >
                                <Plus size={16} />
                                <span>Добавить картинку</span>
                            </button>
                        </div>
                    </div>
                ) : null}

                {block.type === "message" ? (
                    <div className="article-studio__block-form">
                        <div className="columns is-multiline">
                            <div className="column is-half">
                                <label className="label">Тип сообщения</label>
                                <div className="select is-fullwidth">
                                    <select value={block.variant} onChange={event => onChange({ ...block, variant: event.target.value as EditableArticleMessageVariant })}>
                                        <option value="info">info</option>
                                        <option value="success">success</option>
                                        <option value="warning">warning</option>
                                        <option value="dark">dark</option>
                                        <option value="link">link</option>
                                        <option value="danger">danger</option>
                                    </select>
                                </div>
                            </div>
                            <div className="column is-half">
                                <label className="label">Заголовок</label>
                                <input className="input" value={block.title ?? ""} onChange={event => onChange({ ...block, title: event.target.value })} />
                            </div>
                            <div className="column is-full">
                                <div className="article-studio__accordion-settings">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={block.collapsible ?? false}
                                            onChange={event => onChange({ ...block, collapsible: event.target.checked })}
                                        />
                                        <span className="ml-2">Сворачивать сообщение</span>
                                    </label>
                                    {block.collapsible ? (
                                        <label className="checkbox">
                                            <input
                                                type="checkbox"
                                                checked={block.defaultOpen ?? false}
                                                onChange={event => onChange({ ...block, defaultOpen: event.target.checked })}
                                            />
                                            <span className="ml-2">Показывать раскрытым при открытии статьи</span>
                                        </label>
                                    ) : null}
                                </div>
                            </div>
                            <div className="column is-full article-studio__nested-videos">
                                {messageContent.map((content, contentIndex) => {
                                    const updateContent = (nextContent: EditableArticleMessageContent) => {
                                        const next = [...messageContent];
                                        next[contentIndex] = nextContent;
                                        setMessageContent(next);
                                    };
                                    const deleteContent = () => setMessageContent(messageContent.filter((_, index) => index !== contentIndex));
                                    const moveContent = (direction: -1 | 1) => {
                                        const targetIndex = contentIndex + direction;
                                        if (targetIndex < 0 || targetIndex >= messageContent.length) return;
                                        const next = [...messageContent];
                                        [next[contentIndex], next[targetIndex]] = [next[targetIndex], next[contentIndex]];
                                        setMessageContent(next);
                                    };
                                    return <div className="article-studio__message-content" key={content.id}>
                                        <div className="article-studio__message-content-actions">
                                            <span>Элемент {contentIndex + 1}</span>
                                            <button type="button" className="button is-small is-light" disabled={contentIndex === 0} onClick={() => moveContent(-1)} title="Переместить выше" aria-label="Переместить выше"><ArrowUp size={14} /></button>
                                            <button type="button" className="button is-small is-light" disabled={contentIndex === messageContent.length - 1} onClick={() => moveContent(1)} title="Переместить ниже" aria-label="Переместить ниже"><ArrowDown size={14} /></button>
                                        </div>
                                        {content.type === "richText" ? <div className="article-studio__nested-media">
                                            <div className="article-studio__nested-video-header"><strong>Текст</strong><button type="button" className="button is-small is-light" onClick={deleteContent} title="Удалить" aria-label="Удалить"><Trash2 size={15} /></button></div>
                                            <RichTextEditor value={content.html} placeholder="Текст сообщения..." onChange={html => updateContent({ ...content, html })} />
                                        </div> : content.type === "video"
                                            ? <NestedVideoEditor video={content} repoRoot={repoRoot} assetFolder={assetFolder} setStatusMessage={setStatusMessage} onChange={updateContent} onDelete={deleteContent} />
                                            : content.type === "image"
                                                ? <NestedImageEditor image={content} repoRoot={repoRoot} assetFolder={assetFolder} setStatusMessage={setStatusMessage} onChange={updateContent} onDelete={deleteContent} />
                                                : <NestedCarouselEditor carousel={content} repoRoot={repoRoot} assetFolder={assetFolder} setStatusMessage={setStatusMessage} onChange={updateContent} onDelete={deleteContent} />}
                                    </div>;
                                })}
                                <div className="article-studio__nested-media-actions">
                                    <button type="button" className="button is-light" onClick={() => setMessageContent([...messageContent, createEmptyRichTextBlock()])}><FileText size={16} /><span>Добавить текст</span></button>
                                    <button type="button" className="button is-light" onClick={() => setMessageContent([...messageContent, createEmptyImageBlock()])}><ImagePlus size={16} /><span>Добавить картинку</span></button>
                                    <button type="button" className="button is-light" onClick={() => setMessageContent([...messageContent, createEmptyCarouselBlock()])}><LayoutGrid size={16} /><span>Добавить карусель</span></button>
                                    <button type="button" className="button is-light" onClick={() => setMessageContent([...messageContent, createEmptyVideoBlock()])}><Video size={16} /><span>Добавить видео</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {block.type === "spoiler" ? (
                    <div className="article-studio__block-form">
                        <div className="field">
                            <label className="label">Заголовок закрытого блока</label>
                            <input className="input" value={block.summary} onChange={event => onChange({ ...block, summary: event.target.value })} />
                        </div>
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={block.defaultOpen ?? false}
                                onChange={event => onChange({ ...block, defaultOpen: event.target.checked })}
                            />
                            <span className="ml-2">Показывать раскрытым при открытии статьи</span>
                        </label>
                        <RichTextEditor
                            value={block.bodyHtml}
                            placeholder="Текст спойлера..."
                            onChange={html => onChange({ ...block, bodyHtml: html })}
                        />
                    </div>
                ) : null}
            </div> : null}
        </section>
    );
}

function BlockPalette({
    onChoose,
    onClose,
    allowNoteEmbed,
}: {
    onChoose: (type: BlockPaletteType) => void;
    onClose: () => void;
    allowNoteEmbed: boolean;
}) {
    const options: Array<{ type: BlockPaletteType; title: string; description: string; icon: ReactNode }> = [
        { type: "richText", title: "Обычный текст", description: "Абзацы, списки, ссылки, таблицы и фрагменты кода.", icon: <FileText size={18} /> },
        { type: "heading", title: "Заголовок раздела", description: "Крупный H2, средний H3 или небольшой H4.", icon: <Heading2 size={18} /> },
        { type: "image", title: "Одна картинка", description: "Изображение с подписью, источником и настройкой размера.", icon: <ImagePlus size={18} /> },
        { type: "video", title: "Видео", description: "Ссылка YouTube/Vimeo или видеофайл из проекта.", icon: <Video size={18} /> },
        { type: "imageCarousel", title: "Карусель картинок", description: "Один блок с несколькими листаемыми изображениями.", icon: <LayoutGrid size={18} /> },
        { type: "message", title: "Цветная заметка", description: "Важная мысль, совет, предупреждение или цитата. Можно сворачивать.", icon: <MessageSquareMore size={18} /> },
        { type: "noteEmbed", title: "Встроенная заметка", description: "Карточка существующей заметки со ссылкой на оригинал.", icon: <NotebookTabs size={18} /> },
        { type: "spoiler", title: "Раскрывающийся раздел", description: "Скрытый до клика текст, например список литературы.", icon: <Eye size={18} /> },
    ];

    return (
        <div className="article-studio__palette-backdrop" role="presentation" onClick={onClose}>
            <div className="article-studio__palette" role="dialog" aria-modal="true" onClick={event => event.stopPropagation()}>
                <div className="article-studio__palette-header">
                    <h2 className="title is-5 mb-0">Добавить блок</h2>
                    <button type="button" className="button is-light" onClick={onClose} aria-label="Закрыть" title="Закрыть">
                        <X size={16} />
                    </button>
                </div>
                <div className="article-studio__palette-grid">
                    {options.filter(option => allowNoteEmbed || option.type !== "noteEmbed").map(option => (
                        <button
                            key={option.type}
                            type="button"
                            className="article-studio__palette-option"
                            onClick={() => onChoose(option.type)}
                        >
                            <span className="article-studio__palette-icon">{option.icon}</span>
                            <span className="article-studio__palette-text">
                                <strong>{option.title}</strong>
                                <span>{option.description}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ArticleStudio({ notes }: { notes: EmbeddedNoteSummary[] }) {
    const [contentType, setContentType] = useState<"article" | "note">("article");
    const [shouldOptimizeImages, setShouldOptimizeImages] = useState(true);
    const [repoRoot, setRepoRoot] = useState<FileSystemDirectoryHandle | null>(null);
    const [articleId, setArticleId] = useState(() => createId());
    const [openedSource, setOpenedSource] = useState<{
        collectionName: "articles" | "notes";
        fileName: string;
        slug: string;
    } | null>(null);
    const [redirectFrom, setRedirectFrom] = useState<string[]>([]);
    activeEditorContentId = articleId;
    const [publishDate, setPublishDate] = useState(() => getLocalDateInputValue());
    const [publishDateText, setPublishDateText] = useState(() => formatDateInputValue(getLocalDateInputValue()));
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [tags, setTags] = useState<MediaItemTag[]>([]);
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [statusMessage, setStatusMessage] = useState("");
    const [coverUploadMessage, setCoverUploadMessage] = useState("");
    const [coverOptimizationMessage, setCoverOptimizationMessage] = useState("");
    const [blocks, setBlocks] = useState<EditableArticleBlock[]>([createEmptyRichTextBlock()]);
    const [palette, setPalette] = useState<BlockPaletteState | null>(null);
    const [deletedBlock, setDeletedBlock] = useState<{ block: EditableArticleBlock; index: number } | null>(null);
    const deleteUndoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const normalizedSlug = slug.trim();
    const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug);
    const collectionName = contentType === "article" ? "articles" : "notes";
    const contentLabelGenitive = contentType === "article" ? "статьи" : "заметки";
    const contentLabelAccusative = contentType === "article" ? "статью" : "заметку";
    const contentPathPreview = useMemo(
        () => `data/${collectionName}/${normalizedSlug || "your-slug"}.json`,
        [collectionName, normalizedSlug]
    );
    const assetFolder = `${collectionName}/${isSlugValid ? normalizedSlug : ""}`;

    const hasRequiredFields = useMemo(
        () => Boolean(title.trim() && isSlugValid && publishDate),
        [title, isSlugValid, publishDate]
    );
    const readingTimeMinutes = useMemo(() => calculateReadingTimeMinutes(blocks), [blocks]);
    const tocItems = useMemo(() => createTocItemsFromBlocks(blocks), [blocks]);

    useEffect(() => {
        if (!statusMessage) {
            return;
        }

        const timer = window.setTimeout(() => setStatusMessage(""), 7000);
        return () => window.clearTimeout(timer);
    }, [statusMessage]);

    const commitPublishDateText = () => {
        const parsedDate = parseDateInputValue(publishDateText);
        if (parsedDate) {
            setPublishDate(parsedDate);
            setPublishDateText(formatDateInputValue(parsedDate));
        } else {
            setPublishDateText(formatDateInputValue(publishDate));
            setStatusMessage("Введите корректную дату в формате дд.мм.гггг.");
        }
    };

    const connectRepoFolder = async () => {
        const browserWindow = window as DirectoryPickerWindow;

        if (!browserWindow.showDirectoryPicker) {
            setStatusMessage("Этот браузер не поддерживает выбор папки.");
            return;
        }

        const handle = await browserWindow.showDirectoryPicker({ mode: "readwrite" });
        setRepoRoot(handle);
        setCoverUploadMessage("");
        setStatusMessage("Папка репозитория подключена.");
    };

    const storeUpload = async (file: File) => {
        if (!repoRoot) {
            throw new Error("Сначала подключите папку репозитория.");
        }

        if (!isSlugValid) {
            throw new Error("Сначала заполните корректный slug: он станет именем папки для медиафайлов.");
        }

        const imageUrl = await uploadAssetUrl(repoRoot, assetFolder, file, setCoverOptimizationMessage);
        if (!imageUrl) throw new Error("Slug уже занят, обложка не загружена.");
        return imageUrl;
    };

    const uploadCover = async () => {
        if (!repoRoot) {
            const message = "Сначала подключите корневую папку RiceAndStripes, чтобы браузер мог записать изображение в проект.";
            setCoverUploadMessage(message);
            setStatusMessage(message);
            return;
        }

        if (!isSlugValid) {
            const message = "Сначала заполните корректный slug: он станет именем папки для обложки.";
            setCoverUploadMessage(message);
            setStatusMessage(message);
            return;
        }

        const file = await pickFile("image/*");
        if (!file) {
            return;
        }

        setCoverOptimizationMessage("");
        try {
            const imageUrl = await storeUpload(file);
            const previousCoverUrl = coverUrl;
            setCoverUrl(imageUrl);
            if (previousCoverUrl && previousCoverUrl !== imageUrl) {
                setBlocks(currentBlocks => currentBlocks.map(block =>
                    block.type === "image" && block.imageUrl === previousCoverUrl
                        ? { ...block, imageUrl }
                        : block
                ));
            }
            setCoverUploadMessage("");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Не удалось загрузить обложку.";
            setCoverUploadMessage(message);
            setStatusMessage(message);
        }
    };

    const openExistingArticle = async () => {
        const file = await pickFile(".json,application/json");
        if (!file) {
            return;
        }

        try {
            const article = JSON.parse(await file.text()) as EditableArticle | EditableNote;
            if (!article || !Array.isArray(article.blocks) || !article.slug || !article.title) {
                throw new Error("Выбранный JSON не похож на материал из этой админки.");
            }

            setArticleId(article.id || createId());
            const openedContentType = article.contentType === "note" ? "note" : "article";
            setContentType(openedContentType);
            setOpenedSource({
                collectionName: openedContentType === "note" ? "notes" : "articles",
                fileName: file.name,
                slug: article.slug,
            });
            setRedirectFrom(article.redirectFrom ?? []);
            const openedPublishDate = article.publishDate?.slice(0, 10) || getLocalDateInputValue();
            setPublishDate(openedPublishDate);
            setPublishDateText(formatDateInputValue(openedPublishDate));
            setTitle(article.title);
            setSlug(article.slug);
            setDescription(article.description ?? "");
            setCoverUrl(article.coverUrl ?? "");
            setCoverOptimizationMessage("");
            setTags("tags" in article ? article.tags ?? [] : []);
            setBlocks(article.blocks);
            setSaveState("idle");
            setCoverUploadMessage(repoRoot ? "" : "Чтобы заменить обложку, сначала подключите корневую папку проекта.");
            setStatusMessage(`Открыт материал ${file.name}. Подключите папку проекта перед сохранением.`);
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Не удалось открыть материал.");
        }
    };

    const toggleTag = (tag: MediaItemTag) => {
        setTags(currentTags =>
            currentTags.includes(tag)
                ? currentTags.filter(existingTag => existingTag !== tag)
                : [...currentTags, tag]
        );
    };

    const insertBlockAt = (index: number, type: BlockPaletteType) => {
        const nextBlock = createBlock(type);
        setBlocks(current => {
            const next = [...current];
            next.splice(index, 0, nextBlock);
            return next;
        });
    };

    const appendBlock = (type: BlockPaletteType) => {
        setBlocks(current => [...current, createBlock(type)]);
    };

    const updateBlock = (id: string, nextBlock: EditableArticleBlock) => {
        setBlocks(current => current.map(block => (block.id === id ? nextBlock : block)));
    };

    const deleteBlock = (id: string) => {
        const index = blocks.findIndex(block => block.id === id);
        if (index < 0) {
            return;
        }

        if (deleteUndoTimer.current) {
            clearTimeout(deleteUndoTimer.current);
        }

        setDeletedBlock({ block: blocks[index], index });
        deleteUndoTimer.current = setTimeout(() => setDeletedBlock(null), 6000);
        setBlocks(current => current.filter(block => block.id !== id));
    };

    const undoDeleteBlock = () => {
        if (!deletedBlock) {
            return;
        }

        if (deleteUndoTimer.current) {
            clearTimeout(deleteUndoTimer.current);
        }

        setBlocks(current => {
            const next = [...current];
            next.splice(Math.min(deletedBlock.index, next.length), 0, deletedBlock.block);
            return next;
        });
        setDeletedBlock(null);
        setStatusMessage("Удалённый блок восстановлен.");
    };

    const duplicateBlock = (block: EditableArticleBlock) => {
        const clone = JSON.parse(JSON.stringify(block)) as EditableArticleBlock;
        clone.id = createId();
        setBlocks(current => [...current, clone]);
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        setBlocks(current => {
            const next = [...current];
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= next.length) {
                return current;
            }

            const [moved] = next.splice(index, 1);
            next.splice(targetIndex, 0, moved);
            return next;
        });
    };

    const moveBlockToEdge = (index: number, edge: "top" | "bottom") => {
        setBlocks(current => {
            if (index < 0 || index >= current.length) return current;
            const next = [...current];
            const [moved] = next.splice(index, 1);
            next.splice(edge === "top" ? 0 : next.length, 0, moved);
            return next;
        });
    };

    const saveContent = async () => {
        if (!repoRoot) {
            setStatusMessage(`Подключите папку репозитория, чтобы сохранить ${contentLabelAccusative} в проект.`);
            return;
        }

        if (!hasRequiredFields) {
            setStatusMessage("Заполните заголовок, дату публикации и slug в формате fungi-in-food.");
            return;
        }

        const noteEmbedBlocks = blocks.filter((block): block is EditableArticleNoteEmbedBlock => block.type === "noteEmbed");
        if (contentType === "note" && noteEmbedBlocks.length > 0) {
            setStatusMessage("Встроенные заметки можно добавлять только в статью. Удалите такой блок или выберите режим «Статья».");
            return;
        }
        const missingNote = noteEmbedBlocks.find(block => !notes.some(note => note.slug === block.noteSlug));
        if (missingNote) {
            setStatusMessage("В блоке «Встроенная заметка» нужно выбрать существующую заметку.");
            return;
        }

        setSaveState("saving");
        setStatusMessage(`Сохраняю ${contentLabelAccusative}...`);

        try {
            const safeSlug = normalizedSlug;
            await assertContentSlugAvailable(repoRoot, collectionName, safeSlug, articleId);
            const now = new Date().toISOString();
            const isConvertingNote = contentType === "article" && openedSource?.collectionName === "notes";
            const sourceNotePath = isConvertingNote ? `/notes/${openedSource.slug}` : null;
            const nextRedirectFrom = sourceNotePath
                ? Array.from(new Set([...redirectFrom, sourceNotePath]))
                : redirectFrom;
            const normalizedBlocks = normalizeBlockExternalUrls(blocks);
            const html = serializeEditableArticleBlocksToHtml(normalizedBlocks);
            const commonPayload = {
                schemaVersion: 2,
                id: articleId,
                slug: safeSlug,
                title: title.trim(),
                description: description.trim(),
                coverUrl: coverUrl.trim(),
                publishDate: new Date(`${publishDate}T12:00:00`).toISOString(),
                updatedAt: now,
                status: "published",
                blocks: normalizedBlocks,
                html,
                tocItems,
                readingTimeMinutes,
            };
            const payload: EditableArticle | EditableNote = contentType === "article"
                ? { ...commonPayload, contentType: "article", tags, redirectFrom: nextRedirectFrom } as EditableArticle
                : { ...commonPayload, contentType: "note" } as EditableNote;

            const nextFileName = `${safeSlug}.json`;
            await writeTextFile(repoRoot, `data/${collectionName}/${nextFileName}`, `${JSON.stringify(payload, null, 2)}\n`);
            setBlocks(normalizedBlocks);

            if (contentType === "article") {
                for (const legacyPath of nextRedirectFrom) {
                    const match = legacyPath.match(/^\/notes\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
                    if (!match) continue;
                    const redirectPayload: EditableNoteRedirect = {
                        schemaVersion: 2,
                        contentType: "noteRedirect",
                        slug: match[1],
                        redirectTo: `/articles/${safeSlug}`,
                        updatedAt: now,
                    };
                    await writeTextFile(
                        repoRoot,
                        `data/notes/${match[1]}.json`,
                        `${JSON.stringify(redirectPayload, null, 2)}\n`
                    );
                }
            }

            if (isConvertingNote && openedSource) {
                // The redirect stub was written from nextRedirectFrom above.
                if (openedSource.fileName !== `${openedSource.slug}.json`) {
                    await removeFileIfExists(repoRoot, `data/notes/${openedSource.fileName}`);
                }
            } else if (openedSource && (
                openedSource.collectionName !== collectionName
                || openedSource.fileName !== nextFileName
            )) {
                await removeFileIfExists(
                    repoRoot,
                    `data/${openedSource.collectionName}/${openedSource.fileName}`
                );
            }

            setOpenedSource({ collectionName, fileName: nextFileName, slug: safeSlug });
            setRedirectFrom(nextRedirectFrom);

            setSaveState("saved");
            setStatusMessage(`${contentType === "article" ? "Статья" : "Заметка"} сохранена в data/${collectionName}/${safeSlug}.json`);
        } catch (error) {
            setSaveState("error");
            setStatusMessage(error instanceof Error ? error.message : `Не удалось сохранить ${contentLabelAccusative}.`);
        }
    };

    const openPalette = (index: number) => setPalette({ index });

    const choosePaletteItem = (type: BlockPaletteType) => {
        if (palette?.index === null) {
            appendBlock(type);
        } else if (palette?.index !== undefined) {
            insertBlockAt(palette.index, type);
        }

        setPalette(null);
    };

    return (
        <section className="article-studio">
            <div className="article-studio__header">
                <div>
                    <h1 className="title is-2 mb-2">Создание материала</h1>
                    <p className="article-studio__hint">
                        Блоковый редактор сохраняет материал и медиафайлы прямо в папку проекта.
                    </p>
                </div>

                <div className="article-studio__actions">
                    <div className="article-studio__repo-action">
                        <button
                            type="button"
                            className="button is-light"
                            onClick={openExistingArticle}
                            aria-describedby="open-json-help"
                        >
                            <FileJson2 size={18} />
                            <span>Открыть JSON</span>
                            <CircleHelp size={16} aria-hidden="true" />
                        </button>
                        <div id="open-json-help" className="article-studio__repo-help" role="tooltip">
                            В окне выбора файла откройте папку проекта, затем <strong>data → {collectionName}</strong>. Здесь находятся JSON сохранённых материалов выбранного типа. Полный путь: <code>C:\Users\Valnushka\source\repos\RiceAndStripes\data\{collectionName}</code>.
                        </div>
                    </div>
                    <div className="article-studio__repo-action">
                        <button
                            type="button"
                            className="button is-light"
                            onClick={connectRepoFolder}
                            aria-describedby="repo-folder-help"
                        >
                            <FolderOpen size={18} />
                            <span>Подключить папку</span>
                            <CircleHelp size={16} aria-hidden="true" />
                        </button>
                        <div id="repo-folder-help" className="article-studio__repo-help" role="tooltip">
                            Всегда выбирайте папку <strong>C:\Users\Valnushka\source\repos\RiceAndStripes</strong>. Это корень проекта: внутри видны <code>package.json</code>, <code>src</code>, <code>public</code> и <code>data</code>. Подключение разрешает браузеру сохранять JSON, картинки и видео; файлы остаются на вашем компьютере.
                        </div>
                    </div>
                    <button type="button" className="button is-primary" onClick={saveContent}>
                        <Save size={18} />
                        <span>Сохранить {contentLabelAccusative}</span>
                    </button>
                </div>
            </div>

            <div className="notification article-studio__notice">
                На GitHub Pages админка скрыта. Локально откройте проект через <code>npm run dev</code>, подключите папку репозитория и сохраните материал прямо в файлы.
            </div>

            <div className="article-studio__content-type" role="group" aria-label="Тип создаваемого материала">
                <button
                    type="button"
                    className={`button ${contentType === "article" ? "is-selected" : ""}`}
                    aria-pressed={contentType === "article"}
                    onClick={() => { setContentType("article"); setSaveState("idle"); }}
                >
                    Статья
                </button>
                <button
                    type="button"
                    className={`button ${contentType === "note" ? "is-selected" : ""}`}
                    aria-pressed={contentType === "note"}
                    onClick={() => { setContentType("note"); setSaveState("idle"); }}
                >
                    Заметка
                </button>
            </div>

            {contentType === "note" && openedSource?.collectionName === "notes" ? (
                <div className="article-studio__conversion">
                    <div>
                        <strong>Заметка стала достаточно большой?</strong>
                        <p>Преобразуйте её в статью. Старый адрес заметки продолжит работать.</p>
                    </div>
                    <button
                        type="button"
                        className="button article-studio__convert-button"
                        onClick={() => {
                            setContentType("article");
                            setSaveState("idle");
                            setStatusMessage("Выберите теги и сохраните статью. Старый адрес заметки будет перенаправлять читателей автоматически.");
                        }}
                    >
                        <FileText size={18} />
                        <span>Преобразовать в статью</span>
                    </button>
                </div>
            ) : null}

            <div className="article-studio__grid">
                <div className="article-studio__main">
                    <div className="field">
                        <label className="label">Заголовок</label>
                        <div className="control">
                            <input
                                className="input"
                                value={title}
                                onChange={event => setTitle(event.target.value)}
                                placeholder={contentType === "article" ? "Название статьи" : "Название заметки"}
                            />
                        </div>
                    </div>

                    <div className="field">
                            <label className="label">Адрес {contentLabelGenitive} (slug)</label>
                            <div className="control">
                                <input
                                    className={`input ${slug && !isSlugValid ? "is-danger" : ""}`}
                                    value={slug}
                                    onChange={event => setSlug(event.target.value)}
                                    placeholder="my-article"
                                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                                    aria-describedby="slug-help"
                                />
                            </div>
                            <p id="slug-help" className={`help ${slug && !isSlugValid ? "is-danger" : ""}`}>
                                Постоянное имя файла, часть URL и папка медиа: английские слова строчными буквами через дефис. Заполните до загрузки картинок.
                            </p>
                    </div>

                    <div className="field article-studio__publish-date">
                        <label className="label" htmlFor="article-publish-date">Дата публикации</label>
                        <div className="control article-studio__date-control">
                            <input
                                id="article-publish-date"
                                className="input"
                                type="text"
                                value={publishDateText}
                                onChange={event => setPublishDateText(event.target.value)}
                                onBlur={commitPublishDateText}
                                onKeyDown={event => {
                                    if (event.key === "Enter") {
                                        event.currentTarget.blur();
                                    }
                                }}
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="дд.мм.гггг"
                                aria-describedby="publish-date-help"
                                required
                            />
                            <input
                                id="article-publish-date-picker"
                                className="article-studio__native-date"
                                type="date"
                                value={publishDate}
                                onChange={event => {
                                    setPublishDate(event.target.value);
                                    setPublishDateText(formatDateInputValue(event.target.value));
                                }}
                                aria-label="Выбрать дату публикации"
                                required
                            />
                            <CalendarDays size={18} aria-hidden="true" />
                        </div>
                        <p id="publish-date-help" className="help">Для перенесённых материалов можно указать дату первоначальной публикации.</p>
                    </div>

                    <div className="field">
                        <label className="label">Описание</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                value={description}
                                onChange={event => setDescription(event.target.value)}
                                placeholder="Короткое описание для карточки и SEO"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Обложка</label>
                        <div className="article-studio__cover">
                            <input
                                className="input"
                                value={coverUrl}
                                onChange={event => {
                                    setCoverUrl(event.target.value);
                                    setCoverOptimizationMessage("");
                                }}
                                placeholder={`/uploads/${collectionName}/...`}
                            />
                            <button type="button" className="button is-light" onClick={uploadCover}>
                                <ImagePlus size={18} />
                                <span>Загрузить</span>
                            </button>
                        </div>
                        {coverUrl ? (
                            <figure className={`article-studio__cover-preview ${contentType === "note" ? "article-studio__cover-preview--note" : ""} mt-3`}>
                                <img src={withBasePath(coverUrl)} alt="Cover preview" />
                            </figure>
                        ) : null}
                        {coverOptimizationMessage ? <p className="help mt-1">{coverOptimizationMessage}</p> : null}
                        {coverUploadMessage ? (
                            <div className="notification is-warning is-light article-studio__cover-message mt-3">
                                <span>{coverUploadMessage}</span>
                                {!repoRoot ? (
                                    <button type="button" className="button is-small is-warning" onClick={connectRepoFolder}>
                                        <FolderOpen size={15} />
                                        <span>Подключить папку</span>
                                    </button>
                                ) : null}
                            </div>
                        ) : null}
                        <label className="checkbox mt-3">
                            <input
                                type="checkbox"
                                checked={shouldOptimizeImages}
                                onChange={event => {
                                    const checked = event.target.checked;
                                    optimizeUploadedImages = checked;
                                    setShouldOptimizeImages(checked);
                                }}
                            />
                            <span className="ml-2">Оптимизировать новые изображения: WebP, самая большая сторона до 1500 px</span>
                        </label>
                        <p className="help">Если WebP не даёт экономии, файл останется в исходном формате. Снимите флажок, чтобы сохранить исходник без изменений.</p>
                    </div>

                    {contentType === "article" ? <div className="field">
                        <label className="label">Теги</label>
                        <div className="tags are-medium article-studio__tags">
                            {AVAILABLE_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`tag ${tags.includes(tag) ? "is-active" : "is-light"}`}
                                    style={tags.includes(tag) ? {
                                        backgroundColor: MediaItemTagColors[tag].background,
                                        color: MediaItemTagColors[tag].text,
                                    } : undefined}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div> : null}

                    <div className="article-studio__blocks-header">
                        <div>
                            <h2 className="title is-4 mb-1">Блоки {contentLabelGenitive}</h2>
                            <p className="article-studio__hint">Добавляйте блоки один за другим и собирайте {contentLabelAccusative} из готовых карточек.</p>
                        </div>
                        <button type="button" className="button is-light" onClick={() => setPalette({ index: blocks.length })}>
                            <Plus size={18} />
                            <span>Добавить блок</span>
                        </button>
                    </div>

                    <div className="article-studio__blocks">
                        {blocks.map((block, index) => (
                            <BlockCard
                                key={block.id}
                                block={block}
                                notes={notes}
                                index={index}
                                total={blocks.length}
                                repoRoot={repoRoot}
                                assetFolder={isSlugValid ? assetFolder : ""}
                                onChange={nextBlock => updateBlock(block.id, nextBlock)}
                                onDelete={() => deleteBlock(block.id)}
                                onDuplicate={() => duplicateBlock(block)}
                                onMoveUp={() => moveBlock(index, -1)}
                                onMoveDown={() => moveBlock(index, 1)}
                                onMoveToTop={() => moveBlockToEdge(index, "top")}
                                onMoveToBottom={() => moveBlockToEdge(index, "bottom")}
                                onInsertBelow={() => openPalette(index + 1)}
                                setStatusMessage={setStatusMessage}
                            />
                        ))}
                    </div>
                    <div className="article-studio__blocks-footer">
                        <button
                            type="button"
                            className="button is-light"
                            onClick={() => setPalette({ index: blocks.length })}
                        >
                            <Plus size={18} />
                            <span>Добавить новый блок</span>
                        </button>
                    </div>
                </div>

                <aside className="article-studio__sidebar">
                    <div className="notification is-light article-studio__panel">
                        <p className="mb-2"><strong>Готовность {contentLabelGenitive}</strong></p>
                        <p className="is-size-7 has-text-grey mb-1">Папка проекта: {repoRoot ? "подключена" : "сначала подключите"}</p>
                        <p className="is-size-7 has-text-grey mb-1">Файл: {contentPathPreview}</p>
                        <p className="is-size-7 has-text-grey mb-1">Блоков: {blocks.length}</p>
                        <p className="is-size-7 has-text-grey mb-1">Время чтения: {formatReadingTime(readingTimeMinutes)}</p>
                        <p className="is-size-7 has-text-grey mb-1">Сохранение: {{ idle: "изменения не сохранены", saving: "сохраняется...", saved: "сохранено", error: "ошибка" }[saveState]}</p>
                        <p className="is-size-7 has-text-grey">{statusMessage || "Готов к работе"}</p>
                    </div>

                    <div className="notification is-info is-light article-studio__panel">
                        <p className="mb-2"><strong>После нажатия «Сохранить»</strong></p>
                        <ul className="article-studio__list">
                            <li>текст попадёт в <code>{contentPathPreview}</code></li>
                            <li>картинки и видео попадут в <code>public/uploads/{collectionName}/{isSlugValid ? normalizedSlug : "<slug>"}/…</code></li>
                            <li>{contentLabelAccusative} можно будет открыть и проверить локально</li>
                        </ul>
                    </div>

                    <div className="notification is-light article-studio__panel article-studio__toc-preview">
                        <p className="mb-2"><strong>Оглавление</strong></p>
                        {tocItems.length ? (
                            <ol>
                                {tocItems.map(item => (
                                    <li key={item.elementId} className={`article-studio__toc-level-${item.level ?? 2}`}>
                                        <span className="tag is-light">H{item.level ?? 2}</span>
                                        {item.caption}
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="is-size-7 has-text-grey">Добавьте блоки «Заголовок раздела» H2, H3 или H4.</p>
                        )}
                    </div>
                </aside>
            </div>

            {statusMessage ? (
                <div className={`notification article-studio__toast ${/(не удалось|сначала|заполните|подключите|не поддерживает)/i.test(statusMessage) ? "is-warning" : "is-info"}`} role="status" aria-live="polite">
                    <span>{statusMessage}</span>
                    <button type="button" className="delete" onClick={() => setStatusMessage("")} aria-label="Закрыть уведомление" />
                </div>
            ) : null}

            <button
                type="button"
                className="button is-primary article-studio__floating-save"
                onClick={saveContent}
                title={`Сохранить ${contentLabelAccusative}`}
                aria-label={`Сохранить ${contentLabelAccusative}`}
            >
                <Save size={20} />
                <span>Сохранить</span>
            </button>

            {deletedBlock ? (
                <div className="article-studio__undo notification is-dark">
                    <span>Блок удалён</span>
                    <button type="button" className="button is-small is-light" onClick={undoDeleteBlock}>
                        <RotateCcw size={15} />
                        <span>Вернуть</span>
                    </button>
                </div>
            ) : null}

            {palette ? (
                <BlockPalette
                    onChoose={choosePaletteItem}
                    onClose={() => setPalette(null)}
                    allowNoteEmbed={contentType === "article"}
                />
            ) : null}
        </section>
    );
}
