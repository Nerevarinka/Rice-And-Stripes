"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";
import {
    Bold,
    Code2,
    Copy,
    Eye,
    FileText,
    FolderOpen,
    CircleHelp,
    CalendarDays,
    ChevronDown,
    ChevronUp,
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
    EditableArticleBlock,
    EditableArticleHeadingBlock,
    EditableArticleHeadingLevel,
    EditableArticleImageBlock,
    EditableArticleImageCarouselBlock,
    EditableArticleImageSize,
    EditableArticleMessageBlock,
    EditableArticleMessageVariant,
    EditableArticleRichTextBlock,
    EditableArticleSpoilerBlock,
    EditableArticleStatus,
    EditableArticleVideoBlock,
    EditableArticleVideoKind,
} from "@/models/editableArticle";
import { MediaItemTagColors, type MediaItemTag } from "@/models/mediaItemTag";
import { createTocItemsFromBlocks } from "@/shared/utils/extractTocItemsFromHtml";
import { serializeEditableArticleBlocksToHtml } from "@/shared/utils/editableArticleHtml";
import { calculateReadingTimeMinutes, formatReadingTime } from "@/shared/utils/readingTime";
import { withBasePath } from "@/shared/utils/withBasePath";

import "./styles.scss";

const lowlight = createLowlight(common);

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

type ArticleStudioProps = {
    initialStatus?: EditableArticleStatus;
};

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
    return `/uploads/articles/${assetFolder}/${file.name}`;
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
        kind: "youtube",
        src: "",
        caption: "",
        source: "",
        size: "medium",
        title: "",
        spoiler: "",
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
    return {
        id: createId(),
        type: "message",
        variant: "info",
        title: "",
        bodyHtml: "<p></p>",
        collapsible: false,
        defaultOpen: false,
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
            return block.kind === "file" ? "Видео-файл" : "Видео-ссылка";
        case "imageCarousel":
            return "Карусель";
        case "message":
            return `Сообщение (${block.variant})`;
        case "spoiler":
            return "Спойлер";
        default:
            return "Блок";
    }
}

function uploadAssetUrl(
    repoRoot: FileSystemDirectoryHandle,
    assetFolder: string,
    file: File
) {
    const relativePath = `public/uploads/articles/${assetFolder}/${file.name}`;
    return writeBinaryFile(repoRoot, relativePath, file).then(() => makeAssetPath(assetFolder, file));
}

type RichTextEditorProps = {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
};

function RichTextEditor({ value, placeholder, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
                codeBlock: false,
            }),
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
        onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    });

    if (!editor) {
        return null;
    }

    const toggleLink = () => {
        const href = window.prompt("Адрес ссылки");
        if (!href) {
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    };

    const addTable = () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    const hasTable = editor.getHTML().includes("<table");
    const setCellAlignment = (textAlign: "left" | "center") => {
        editor.chain().focus().run();
        editor.commands.updateAttributes("tableCell", { textAlign });
        editor.commands.updateAttributes("tableHeader", { textAlign });
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
            <div className="article-studio__toolbar">
                <button type="button" className={`button is-small ${editor.isActive("bold") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Жирный" title="Жирный">
                    <Bold size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("italic") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Курсив" title="Курсив">
                    <Italic size={16} />
                </button>
                <button type="button" className={`button is-small ${editor.isActive("strike") ? "is-link" : "is-light"}`} onClick={() => editor.chain().focus().toggleStrike().run()} aria-label="Зачёркнутый текст" title="Зачёркнутый текст">
                    <Strikethrough size={16} />
                </button>
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
                    {tableActions.map(item => (
                        <button key={item.label} type="button" className="button is-small is-light" onClick={item.action}>
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

type BlockCardProps = {
    block: EditableArticleBlock;
    index: number;
    total: number;
    repoRoot: FileSystemDirectoryHandle | null;
    assetFolder: string;
    onChange: (block: EditableArticleBlock) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onInsertBelow: () => void;
    setStatusMessage: (message: string) => void;
};

function BlockCard({
    block,
    index,
    total,
    repoRoot,
    assetFolder,
    onChange,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onInsertBelow,
    setStatusMessage,
}: BlockCardProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
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

        const imageUrl = await uploadAssetUrl(repoRoot, assetFolder, file);

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
                alt: currentImage.alt || file.name,
            };
            onChange({ ...block, images: nextImages });
        }
    };

    return (
        <section className={`article-studio__block article-studio__block--${block.type}${block.type === "message" ? ` article-studio__block--message-${block.variant}` : ""}`}>
            <div className="article-studio__block-header">
                <div className="article-studio__block-title">
                    <span className="article-studio__block-type">{getBlockLabel(block)}</span>
                    <span className="article-studio__block-index">#{index + 1}</span>
                </div>

                <div className="article-studio__block-actions">
                    <button
                        type="button"
                        className="button is-small is-light"
                        onClick={() => setIsCollapsed(current => !current)}
                        aria-label={isCollapsed ? "Развернуть блок" : "Свернуть блок"}
                        title={isCollapsed ? "Развернуть блок" : "Свернуть блок"}
                    >
                        {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onMoveUp} disabled={index === 0} aria-label="Переместить блок выше" title="Переместить блок выше">
                        <ArrowUp size={16} />
                    </button>
                    <button type="button" className="button is-small is-light" onClick={onMoveDown} disabled={index === total - 1} aria-label="Переместить блок ниже" title="Переместить блок ниже">
                        <ArrowDown size={16} />
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

                {block.type === "image" ? (
                    <div className="article-studio__block-form">
                        <div className={`article-studio__asset-preview article-studio__asset-preview--${block.size}${block.imageUrl ? "" : " article-studio__asset-preview--empty"}`}>
                            {block.imageUrl ? <img src={withBasePath(block.imageUrl)} alt={block.alt || block.caption || "preview"} /> : <div className="article-studio__asset-placeholder">Нет изображения</div>}
                        </div>
                        <div className="field is-grouped">
                            <p className="control is-expanded">
                                <input className="input" value={block.imageUrl} onChange={event => onChange({ ...block, imageUrl: event.target.value })} placeholder="/uploads/articles/..." />
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
                                <textarea className="textarea" rows={3} value={block.caption} onChange={event => onChange({ ...block, caption: event.target.value })} />
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
                                        <option value="youtube">YouTube</option>
                                        <option value="vk">VK Видео</option>
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
                            <div className="column is-full">
                                <label className="label">{block.kind === "file" ? "Путь к видеофайлу" : "Ссылка на видео"}</label>
                                <div className="field is-grouped">
                                    <p className="control is-expanded">
                                        <input className="input" value={block.src} onChange={event => onChange({ ...block, src: event.target.value })} placeholder={block.kind === "file" ? "/uploads/articles/..." : block.kind === "vk" ? "https://vkvideo.ru/video-..._..." : block.kind === "rutube" ? "https://rutube.ru/video/..." : block.kind === "vimeo" ? "https://vimeo.com/..." : "https://www.youtube.com/watch?v=..."} />
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

                                                    const videoUrl = await uploadAssetUrl(repoRoot, assetFolder, file);
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
                                <textarea className="textarea" rows={3} value={block.caption} onChange={event => onChange({ ...block, caption: event.target.value })} />
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
                                <label className="label">Спойлер</label>
                                <input className="input" value={block.spoiler ?? ""} onChange={event => onChange({ ...block, spoiler: event.target.value })} />
                                <p className="help">Необязательно. Укажите предупреждение, если видео нужно скрыть до клика, например «Сцены медицинских процедур».</p>
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
                                    <textarea
                                        className="textarea"
                                        rows={2}
                                        value={image.caption ?? ""}
                                        onChange={event => {
                                            const nextImages = [...block.images];
                                            nextImages[imageIndex] = { ...image, caption: event.target.value };
                                            onChange({ ...block, images: nextImages });
                                        }}
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
                            <div className="column is-full">
                                <RichTextEditor
                                    value={block.bodyHtml}
                                    placeholder="Текст сообщения..."
                                    onChange={html => onChange({ ...block, bodyHtml: html })}
                                />
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
}: {
    onChoose: (type: BlockPaletteType) => void;
    onClose: () => void;
}) {
    const options: Array<{ type: BlockPaletteType; title: string; description: string; icon: ReactNode }> = [
        { type: "richText", title: "Обычный текст", description: "Абзацы, списки, ссылки, таблицы и фрагменты кода.", icon: <FileText size={18} /> },
        { type: "heading", title: "Заголовок раздела", description: "Крупный H2, средний H3 или небольшой H4.", icon: <Heading2 size={18} /> },
        { type: "image", title: "Одна картинка", description: "Изображение с подписью, источником и настройкой размера.", icon: <ImagePlus size={18} /> },
        { type: "video", title: "Видео", description: "Ссылка YouTube/Vimeo или видеофайл из проекта.", icon: <Video size={18} /> },
        { type: "imageCarousel", title: "Карусель картинок", description: "Один блок с несколькими листаемыми изображениями.", icon: <LayoutGrid size={18} /> },
        { type: "message", title: "Цветная заметка", description: "Важная мысль, совет, предупреждение или цитата. Можно сворачивать.", icon: <MessageSquareMore size={18} /> },
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
                    {options.map(option => (
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

export default function ArticleStudio({ initialStatus = "draft" }: ArticleStudioProps) {
    const [repoRoot, setRepoRoot] = useState<FileSystemDirectoryHandle | null>(null);
    const [articleId, setArticleId] = useState(() => createId());
    const [publishDate, setPublishDate] = useState(() => getLocalDateInputValue());
    const [publishDateText, setPublishDateText] = useState(() => formatDateInputValue(getLocalDateInputValue()));
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [tags, setTags] = useState<MediaItemTag[]>([]);
    const [status, setStatus] = useState<EditableArticleStatus>(initialStatus);
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const [statusMessage, setStatusMessage] = useState("");
    const [coverUploadMessage, setCoverUploadMessage] = useState("");
    const [blocks, setBlocks] = useState<EditableArticleBlock[]>([createEmptyRichTextBlock()]);
    const [palette, setPalette] = useState<BlockPaletteState | null>(null);
    const [deletedBlock, setDeletedBlock] = useState<{ block: EditableArticleBlock; index: number } | null>(null);
    const deleteUndoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const normalizedSlug = slug.trim();
    const isSlugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug);
    const articlePathPreview = useMemo(
        () => `data/articles/${normalizedSlug || "your-article-slug"}.json`,
        [normalizedSlug]
    );

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

        return uploadAssetUrl(repoRoot, normalizedSlug, file);
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

        try {
            const imageUrl = await storeUpload(file);
            setCoverUrl(imageUrl);
            setCoverUploadMessage("");
            setStatusMessage(`Обложка сохранена в ${imageUrl}`);
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
            const article = JSON.parse(await file.text()) as EditableArticle;
            if (!article || !Array.isArray(article.blocks) || !article.slug || !article.title) {
                throw new Error("Выбранный JSON не похож на статью из этой админки.");
            }

            setArticleId(article.id || createId());
            const openedPublishDate = article.publishDate?.slice(0, 10) || getLocalDateInputValue();
            setPublishDate(openedPublishDate);
            setPublishDateText(formatDateInputValue(openedPublishDate));
            setTitle(article.title);
            setSlug(article.slug);
            setDescription(article.description ?? "");
            setCoverUrl(article.coverUrl ?? "");
            setTags(article.tags ?? []);
            setStatus(article.status ?? "draft");
            setBlocks(article.blocks);
            setSaveState("idle");
            setCoverUploadMessage(repoRoot ? "" : "Чтобы заменить обложку, сначала подключите корневую папку проекта.");
            setStatusMessage(`Открыта статья ${file.name}. Подключите папку проекта перед сохранением.`);
        } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Не удалось открыть статью.");
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

    const saveArticle = async () => {
        if (!repoRoot) {
            setStatusMessage("Подключите папку репозитория, чтобы сохранить статью в проект.");
            return;
        }

        if (!hasRequiredFields) {
            setStatusMessage("Заполните заголовок, дату публикации и slug в формате fungi-in-food.");
            return;
        }

        setSaveState("saving");
        setStatusMessage("Сохраняю статью...");

        try {
            const safeSlug = normalizedSlug;
            const now = new Date().toISOString();
            const html = serializeEditableArticleBlocksToHtml(blocks);
            const payload: EditableArticle = {
                schemaVersion: 2,
                id: articleId,
                slug: safeSlug,
                title: title.trim(),
                description: description.trim(),
                coverUrl: coverUrl.trim(),
                publishDate: new Date(`${publishDate}T12:00:00`).toISOString(),
                updatedAt: now,
                status,
                tags,
                blocks,
                html,
                tocItems,
                readingTimeMinutes,
            };

            await writeTextFile(repoRoot, `data/articles/${safeSlug}.json`, `${JSON.stringify(payload, null, 2)}\n`);

            setSaveState("saved");
            setStatusMessage(`Статья сохранена в data/articles/${safeSlug}.json`);
        } catch (error) {
            setSaveState("error");
            setStatusMessage(error instanceof Error ? error.message : "Не удалось сохранить статью.");
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
                    <h1 className="title is-2 mb-2">Создание статьи</h1>
                    <p className="article-studio__hint">
                        Блоковый редактор сохраняет статью и медиафайлы прямо в папку проекта.
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
                            В окне выбора файла откройте папку проекта, затем <strong>data → articles</strong>. Эта папка хранит JSON уже сохранённых статей; пока статей нет, внутри будет только служебный файл <code>.gitkeep</code>. Полный путь: <code>C:\Users\Valnushka\source\repos\RiceAndStripes\data\articles</code>.
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
                    <button type="button" className="button is-primary" onClick={saveArticle}>
                        <Save size={18} />
                        <span>Сохранить статью</span>
                    </button>
                </div>
            </div>

            <div className="notification article-studio__notice">
                На GitHub Pages админка скрыта. Локально откройте проект через <code>npm run dev</code>, подключите папку репозитория и сохраните статью прямо в файлы.
            </div>

            <div className="article-studio__grid">
                <div className="article-studio__main">
                    <div className="field">
                        <label className="label">Заголовок</label>
                        <div className="control">
                            <input
                                className="input"
                                value={title}
                                onChange={event => setTitle(event.target.value)}
                                placeholder="Название статьи"
                            />
                        </div>
                    </div>

                    <div className="article-studio__two-cols">
                        <div className="field">
                            <label className="label">Адрес статьи (slug)</label>
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

                        <div className="field">
                            <label className="label">Статус</label>
                            <div className="select is-fullwidth">
                                <select value={status} onChange={event => setStatus(event.target.value as EditableArticleStatus)}>
                                    <option value="draft">Черновик</option>
                                    <option value="published">Опубликована</option>
                                </select>
                            </div>
                        </div>
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
                                onChange={event => setCoverUrl(event.target.value)}
                                placeholder="/uploads/articles/..."
                            />
                            <button type="button" className="button is-light" onClick={uploadCover}>
                                <ImagePlus size={18} />
                                <span>Загрузить</span>
                            </button>
                        </div>
                        {coverUrl ? (
                            <figure className="article-studio__cover-preview mt-3">
                                <img src={withBasePath(coverUrl)} alt="Cover preview" />
                            </figure>
                        ) : null}
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
                    </div>

                    <div className="field">
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
                    </div>

                    <div className="article-studio__blocks-header">
                        <div>
                            <h2 className="title is-4 mb-1">Блоки статьи</h2>
                            <p className="article-studio__hint">Добавляйте блоки один за другим и собирайте статью из готовых карточек.</p>
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
                                index={index}
                                total={blocks.length}
                                repoRoot={repoRoot}
                                assetFolder={isSlugValid ? normalizedSlug : ""}
                                onChange={nextBlock => updateBlock(block.id, nextBlock)}
                                onDelete={() => deleteBlock(block.id)}
                                onDuplicate={() => duplicateBlock(block)}
                                onMoveUp={() => moveBlock(index, -1)}
                                onMoveDown={() => moveBlock(index, 1)}
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
                        <p className="mb-2"><strong>Готовность статьи</strong></p>
                        <p className="is-size-7 has-text-grey mb-1">Папка проекта: {repoRoot ? "подключена" : "сначала подключите"}</p>
                        <p className="is-size-7 has-text-grey mb-1">Файл статьи: {articlePathPreview}</p>
                        <p className="is-size-7 has-text-grey mb-1">Блоков в статье: {blocks.length}</p>
                        <p className="is-size-7 has-text-grey mb-1">Время чтения: {formatReadingTime(readingTimeMinutes)}</p>
                        <p className="is-size-7 has-text-grey mb-1">Сохранение: {{ idle: "изменения не сохранены", saving: "сохраняется...", saved: "сохранено", error: "ошибка" }[saveState]}</p>
                        <p className="is-size-7 has-text-grey">{statusMessage || "Готов к работе"}</p>
                    </div>

                    <div className="notification is-info is-light article-studio__panel">
                        <p className="mb-2"><strong>После нажатия «Сохранить»</strong></p>
                        <ul className="article-studio__list">
                            <li>текст статьи попадёт в <code>{articlePathPreview}</code></li>
                            <li>картинки и видео попадут в <code>public/uploads/articles/{isSlugValid ? normalizedSlug : "<slug>"}/…</code></li>
                            <li>статью можно будет открыть и проверить локально</li>
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
                onClick={saveArticle}
                title="Сохранить статью"
                aria-label="Сохранить статью"
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
                />
            ) : null}
        </section>
    );
}
