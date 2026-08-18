export default async function CreateArticlePage() {
    if (process.env.NODE_ENV === "production") {
        return (
            <section className="section">
                <div className="container">
                    <div className="notification is-warning">
                        Админка недоступна в опубликованной версии сайта. Откройте проект локально через
                        <code> npm run dev</code>, чтобы создать или отредактировать статью.
                    </div>
                </div>
            </section>
        );
	}

	const [{ default: ArticleStudio }, { editableNoteToEmbedSummary, getEditableNotes }] = await Promise.all([
		import("@/components/admin/articleStudio"),
		import("@/shared/editableNotes"),
	]);
	const notes = (await getEditableNotes()).map(editableNoteToEmbedSummary);
	return <ArticleStudio notes={notes} />;
}
