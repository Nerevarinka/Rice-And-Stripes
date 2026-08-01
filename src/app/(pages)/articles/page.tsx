import ArticlesContainer from "./content";
export { metadata } from "./metadata";
import { getAllArticleCards } from "@/shared/articleCatalog";

export default async function ArticlesPage() {
	const articles = await getAllArticleCards();

	return <ArticlesContainer articles={articles} />;
}
