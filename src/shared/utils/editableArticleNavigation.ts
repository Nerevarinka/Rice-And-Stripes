import { getAllArticleCards } from "@/shared/articleCatalog";

export async function getEditableArticleNavigation(currentLink: string) {
    const articles = await getAllArticleCards();
    const currentIndex = articles.findIndex(article => article.link === currentLink);

    if (currentIndex === -1) {
        return { previousArticle: undefined, nextArticle: undefined };
    }

    const previousArticle =
        currentIndex > 0
            ? {
                  title: articles[currentIndex - 1].caption,
                  link: articles[currentIndex - 1].link,
              }
            : undefined;

    const nextArticle =
        currentIndex < articles.length - 1
            ? {
                  title: articles[currentIndex + 1].caption,
                  link: articles[currentIndex + 1].link,
              }
            : undefined;

    return { previousArticle, nextArticle };
}
