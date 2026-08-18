import { siteConfig, withSiteBasePath } from "@/shared/siteConfig";

export const withBasePath = withSiteBasePath;

export const withBasePathIfInternal = (path: string) => {
  const sameSitePath = path.startsWith(`${siteConfig.origin}/`)
    ? path.slice(siteConfig.origin.length)
    : path;

  if (sameSitePath !== path) {
    if (sameSitePath === siteConfig.basePath || sameSitePath.startsWith(`${siteConfig.basePath}/`)) {
      return path;
    }

    if (/^\/(articles|notes|about|finches|search|home)(?:\/|$)/.test(sameSitePath)) {
      return `${siteConfig.origin}${withBasePath(sameSitePath)}`;
    }
  }

  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith(`${siteConfig.basePath}/`)) {
    return path;
  }

  return withBasePath(path);
};
