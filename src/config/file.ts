import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { z } from "zod/mini";

import { Formality } from "./formality.js";
import { TargetLanguage } from "./target-language.js";

/**
 * Gets the configuration from the specified path, or `translations.config.json`
 * @param path Path to the configuration file.
 * @returns The configuration.
 */
export async function getConfig(path: string | undefined): Promise<Configuration> {
	path ??= "translations.config.json";
	if (!existsSync(path)) {
		throw new Error(`${path} does not exist`);
	}

	const contents = await readFile(path, { encoding: "utf-8" });
	const json = JSON.parse(contents);

	return Config.parse(json);
}

/**
 * Configuration that defines the translations.
 */
export type Configuration = z.infer<typeof Config>;

const Config = z.object({
	formality: z._default(Formality, "less"),
	source: z.string(),
	targets: z.array(TargetLanguage),
});
