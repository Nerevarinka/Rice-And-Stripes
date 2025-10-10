import { defineConfig } from "vite";

import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
	],
	resolve: {
		alias: {
			"@styles": "/src/shared/styles",
		},
	},
	build: {
		sourcemap: true,
	},
	base: "/rice-and-stripes/",
});
