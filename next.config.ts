import type { NextConfig } from "next";
import { siteConfig } from "./src/shared/siteConfig";

export const ASSETS_PREFIX = `${siteConfig.basePath}/`;

const nextConfig: NextConfig = {
	output: "export",
  	basePath: siteConfig.basePath,
	turbopack: {
		root: process.cwd(),
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
