import { cancel } from "@clack/prompts";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { z } from "zod/mini";

import { Formality } from "./formality.js";
import { TargetLanguage } from "./target-language.js";

export const DEFAULT_CONFIG_PATH = "translations.config.json";

/**
 * Gets the configuration from the specified path, or `translations.config.json`
 * @param path Path to the configuration file.
 * @returns The configuration.
 */
export async function getConfig(path: string | undefined): Promise<Configuration> {
	path ??= DEFAULT_CONFIG_PATH;
	if (!existsSync(path)) {
		throw new Error(`${path} does not exist`);
	}

	const json = await readFile(path, { encoding: "utf-8" });
	const config = JSON.parse(json);

	const result = Config.safeParse(config);
	if (!result.success) {
		cancel("Configuration file format is invalid");
		process.exit(1);
	}

	return result.data;
}

/**
 * Configuration that defines the translations.
 */
export type Configuration = z.infer<typeof Config>;

const Config = z.object({
	formality: z.optional(Formality),
	source: z.string(),
	targets: z.array(TargetLanguage),
});
