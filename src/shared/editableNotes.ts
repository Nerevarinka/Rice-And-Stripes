import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { EditableNote, Note } from "@/models";
import { normalizeEditableArticleAssetUrl } from "@/shared/editableArticles";

const NOTES_DIR = path.join(process.cwd(), "data", "notes");

async function readEditableNoteFile(fileName: string): Promise<EditableNote | null> {
    try {
        const raw = await readFile(path.join(NOTES_DIR, fileName), "utf8");
        const note = JSON.parse(raw) as EditableNote;
        return note.contentType === "note" && Array.isArray(note.blocks) ? note : null;
    } catch {
        return null;
    }
}

export async function getEditableNotes(): Promise<EditableNote[]> {
    try {
        const fileNames = await readdir(NOTES_DIR);
        const notes = await Promise.all(
            fileNames
                .filter(fileName => fileName.endsWith(".json"))
                .map(readEditableNoteFile)
        );

        return notes
            .filter((note): note is EditableNote => note !== null)
            .sort((left, right) =>
                new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime()
            );
    } catch {
        return [];
    }
}

export async function getEditableNoteBySlug(slug: string): Promise<EditableNote | null> {
    const notes = await getEditableNotes();
    return notes.find(note => note.slug === slug) ?? null;
}

export function editableNoteToCard(note: EditableNote): Note {
    return {
        caption: note.title,
        link: `/notes/${note.slug}`,
        description: note.description,
        publishDate: new Date(note.publishDate),
        updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
        tags: [],
        image: note.coverUrl ? normalizeEditableArticleAssetUrl(note.coverUrl) : undefined,
        imageAlt: note.title,
    };
}
