import { ASSETS_PREFIX } from "../../../next.config";

/**
 * Формирование пути до ресурса с учетом конфигурации сайта
 * @param path Путь до ресурса
 * @returns Путь до ресурса с учетом конфигурации
 */
export const generateAssetPath = (path: string): string => {
    if (path.toLowerCase().startsWith(ASSETS_PREFIX.toLowerCase())) {
        return path;
    }

    return `${ASSETS_PREFIX}${path}`.replaceAll("//", "/");
};