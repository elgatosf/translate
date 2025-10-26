import { execSync } from "node:child_process";
import { defineConfig, type RolldownPluginOption } from "rolldown";

export default defineConfig({
	input: "src/main.ts",
	output: {
		file: "bin/main.js",
		format: "esm",
	},
	external: ["jsdom"],
	platform: "node",
	plugins: [
		typeCheck(),
	],
});

/**
 * Basic rolldown plugin that adds type-checking.
 * @returns The plugin.
 */
function typeCheck(): RolldownPluginOption {
	return {
		name: "type-check",
		buildStart() {
			try {
				const output = execSync("tsc --noEmit", { encoding: "utf-8" });
				if (output.trim()) {
					this.info(output);
				}
			} catch (err) {
				if (err.stdout) {
					this.error(err.stdout.toString());
				}

				if (err.stderr) {
					this.error(err.stderr.toString());
				}

				throw err;
			}
		},
	};
}
