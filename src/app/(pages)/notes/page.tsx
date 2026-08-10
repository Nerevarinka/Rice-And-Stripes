import Content from "./content";
import { notes as staticNotes } from "@/shared/notes";
import { editableNoteToCard, getEditableNotes } from "@/shared/editableNotes";
export { metadata } from "./metadata";

export default async function NotesPage() {
	const editableNotes = await getEditableNotes();
	return <Content notes={[...staticNotes, ...editableNotes.map(editableNoteToCard)]} />;
}
