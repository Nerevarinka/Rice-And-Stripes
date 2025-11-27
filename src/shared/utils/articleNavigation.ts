import { articles } from "../articles";

/**
 * Получить навигацию для статьи (предыдущая и следующая)
 */
export const getArticleNavigation = (currentLink: string) => {
    const currentIndex = articles.findIndex((article) => article.link === currentLink);

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
};
