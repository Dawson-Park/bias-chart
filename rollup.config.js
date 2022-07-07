import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "./src/index.ts",
	output: [
		{
			file: "./dist/bundle.js",
			format: "es",
			name: "@acryl/bias-chart",
			sourcemap: true,
		},
		// {
		// 	file: "./dist/common.js",
		// 	format: "cjs",
		// 	name: "@acryl/bias-chart",
		// 	sourcemap: true,
		// }
	],
	plugins: [
		babel({
			babelHelpers: "bundled",
			presets: [
				"@babel/preset-env",
				"@babel/preset-react",
				"@babel/preset-typescript",
			],
			// exclude: ["node_modules/**"],
			extensions: [".js", ".jsx", ".ts", ".tsx"],
		}),
		resolve({
			extensions: [".js", ".jsx", ".ts", ".tsx"]
		}),
		typescript()
	],
	external: ['react', 'react-dom', 'styled-components']
}