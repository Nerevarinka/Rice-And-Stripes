import type { NextConfig } from "next";

export const ASSETS_PREFIX = "/Rice-And-Stripes/";

const nextConfig: NextConfig = {
	output: "export",
  	basePath: "/Rice-And-Stripes",
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
