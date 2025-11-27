import type { NextConfig } from "next";

export const ASSETS_PREFIX = "/Rice-And-Stripes/";

const nextConfig: NextConfig = {
	output: "export",
  	basePath: "/Rice-And-Stripes",
  	assetPrefix: ASSETS_PREFIX,
};

export default nextConfig;
