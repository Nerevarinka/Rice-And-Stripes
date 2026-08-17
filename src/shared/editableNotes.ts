import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { EditableNote, EditableNoteRedirect, Note } from "@/models";
import { normalizeEditableArticleAssetUrl } from "@/shared/editableArticles";

const NOTES_DIR = path.join(process.cwd(), "data", "notes");

type EditableNoteFile = EditableNote | EditableNoteRedirect;

async function readEditableNoteFile(fileName: string): Promise<EditableNoteFile | null> {
    try {
        const raw = await readFile(path.join(NOTES_DIR, fileName), "utf8");
        const note = JSON.parse(raw) as EditableNoteFile;
        if (note.contentType === "note" && Array.isArray(note.blocks)) return note;
        if (note.contentType === "noteRedirect" && note.slug && note.redirectTo) return note;
        return null;
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
            .filter((note): note is EditableNote => note?.contentType === "note")
            .sort((left, right) =>
                new Date(right.publishDate).getTime() - new Date(left.publishDate).getTime()
            );
    } catch {
        return [];
    }
}

export async function getEditableNoteRedirects(): Promise<EditableNoteRedirect[]> {
    try {
        const fileNames = await readdir(NOTES_DIR);
        const notes = await Promise.all(
            fileNames
                .filter(fileName => fileName.endsWith(".json"))
                .map(readEditableNoteFile)
        );
        return notes.filter((note): note is EditableNoteRedirect => note?.contentType === "noteRedirect");
    } catch {
        return [];
    }
}

export async function getEditableNoteRedirectBySlug(slug: string): Promise<EditableNoteRedirect | null> {
    const redirects = await getEditableNoteRedirects();
    return redirects.find(redirect => redirect.slug === slug) ?? null;
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
