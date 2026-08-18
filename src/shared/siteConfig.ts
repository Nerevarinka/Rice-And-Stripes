export const siteConfig = {
    name: "Rice & Stripes",
    author: "Nerevarinka",
    origin: "https://nerevarinka.github.io",
    basePath: "/Rice-And-Stripes",
    description: "Блог о жизни амадин: уход, наблюдения, наука",
    socialImage: "/logoV2-preview-v2.jpg",
} as const;

export const siteUrl = `${siteConfig.origin}${siteConfig.basePath}`;

export function withSiteBasePath(pathname: string) {
    if (!pathname || pathname === "/") return siteConfig.basePath;
    if (pathname === siteConfig.basePath || pathname.startsWith(`${siteConfig.basePath}/`)) {
        return pathname;
    }
    return `${siteConfig.basePath}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function absoluteSiteUrl(pathname = "/") {
    if (/^https?:\/\//i.test(pathname)) return pathname;
    return `${siteConfig.origin}${withSiteBasePath(pathname)}`;
}
