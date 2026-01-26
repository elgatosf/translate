#!/usr/bin/env node
import * as p from "@clack/prompts";
import { DeepLClient } from "deepl-node";
import { dirname } from "node:path";

import { getConfig } from "../config/config.js";
import { translateWithDeepL } from "../deepl.js";
import { getFileHandler } from "../file-handlers/file-handler.js";

/**
 * Translates the resources.
 * @param opts Translations options.
 */
export async function translate(opts: Options): Promise<void> {
	const { authKey = process.env.DEEPL_AUTH_KEY, config: configPath } = opts;

	// Get the command line options, and validate we have an auth key.
	if (!authKey) {
		p.cancel("DeepL auth key is not defined");
		process.exit(1);
	}

	p.intro("Translating");
	const spinner = p.spinner();

	// Load the configuration.
	spinner.start("Loading config");
	const config = await getConfig(configPath);
	spinner.stop(`Found ${config.targets.length} language(s)`);

	// Initialize the file handler and DeepL client.
	const fileHandler = await getFileHandler(config.source);
	const deeplClient = new DeepLClient(authKey);

	// Translate languages.
	for (const language of config.targets) {
		try {
			spinner.start(`Translating ${language.code}`);
			const output = await translateWithDeepL({
				client: deeplClient,
				config,
				fileHandler,
				language,
				outDir: dirname(config.source),
			});

			spinner.stop(`Saved ${output}`);
		} catch (e) {
			spinner.stop(`Failed to translate ${language.code}`);
			p.cancel(`${e}`);

			process.exit(1);
		}
	}

	p.outro("Done");
}

interface Options {
	/**
	 * DeepL auth key.
	 */
	authKey?: string;

	/**
	 * Path to the local config; default `translations.config.json`.
	 */
	config: string | undefined;
}
