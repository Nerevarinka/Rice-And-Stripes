import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

import { globalIgnores } from "eslint/config";

export default tseslint.config([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
			pluginImport.flatConfigs.react,
			pluginReact.configs.flat.all,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				React: "readonly",
				JSX: "readonly",
				NodeJS: "readonly",
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			"react/react-in-jsx-scope": 0,
			"no-unused-vars": 0,
			"react/jsx-indent": 0,
			"react/jsx-no-literals": 0,
			"react/no-set-state": 0,
			"react/require-optimization": 0,
			"react/jsx-newline": 0,
			"react/jsx-max-depth": [1, { "max": 7 }],
			"react/jsx-sort-props": 0,
			"react/jsx-wrap-multilines": 0,
			"react/jsx-props-no-spreading": 0,
			"react/require-default-props": 0,
			"react/prefer-read-only-props": 0,
			"react/forbid-component-props": 0,
			"react/jsx-curly-newline": 0,
			"react/jsx-props-no-multi-spaces": 0,
			"react/hook-use-state": 0,
			"react/jsx-indent-props": 0,
			"react/jsx-no-bind": 0,
			"react/no-unstable-nested-components": 0,
			"react/function-component-definition": [2, { "namedComponents": "arrow-function" }],
			"react/jsx-filename-extension": [
				"warn",
				{
					"extensions": [
						".tsx"
					]
				}
			],
			"react/prop-types": "warn",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "error",
			"eol-last": "warn",
			"semi": "error"
		},
		settings: {
			react: {
				version: "detect"
			},
		}
	},
]);
