const BASE_PATH = "/Rice-And-Stripes";

export const withBasePath = (path: string) =>
  `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;