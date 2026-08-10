const BASE_PATH = "/Rice-And-Stripes";

export const withBasePath = (path: string) =>
  `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;

export const withBasePathIfInternal = (path: string) => {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }

  return withBasePath(path);
};
