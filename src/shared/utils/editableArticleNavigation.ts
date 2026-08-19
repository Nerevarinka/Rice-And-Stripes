import { getAllArticleCards } from "@/shared/articleCatalog";
import { getPublicationNavigation } from "@/shared/utils/publicationNavigation";

export async function getEditableArticleNavigation(currentLink: string) {
    const articles = await getAllArticleCards();
    return getPublicationNavigation(
        articles.map(article => ({ title: article.caption, link: article.link })),
        currentLink
    );
}
