const BASE_PATH = "/Rice-And-Stripes";
const SITE_ORIGIN = "https://nerevarinka.github.io";

export const withBasePath = (path: string) =>
  `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;

export const withBasePathIfInternal = (path: string) => {
  const sameSitePath = path.startsWith(`${SITE_ORIGIN}/`)
    ? path.slice(SITE_ORIGIN.length)
    : path;

  if (sameSitePath !== path) {
    if (sameSitePath === BASE_PATH || sameSitePath.startsWith(`${BASE_PATH}/`)) {
      return path;
    }

    if (/^\/(articles|notes|about|finches|search|home)(?:\/|$)/.test(sameSitePath)) {
      return `${SITE_ORIGIN}${withBasePath(sameSitePath)}`;
    }
  }

  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }

  return withBasePath(path);
};
