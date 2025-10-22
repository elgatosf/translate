#!/usr/bin/env node
import * as p from "@clack/prompts";
import { DeepLClient } from "deepl-node";
import { dirname } from "node:path";

import { getOptions } from "./config/cli.js";
import { getConfig } from "./config/file.js";
import { getFileManager } from "./file-manager.js";
import { translate } from "./translate.js";

/**
 * Get the command line options, and validate we have an auth key.
 */
const opts = getOptions();
if (!opts.authKey) {
	p.cancel("DeepL auth key is not defined, please specify -k|--deepl-key");
	process.exit(1);
}

p.intro("Translating");
const spinner = p.spinner();

/**
 * Load the configuration.
 */
spinner.start("Loading config");
const config = await getConfig(opts.config);
spinner.stop(`Found ${config.targets.length} language(s)`);

/**
 * Initialize the file manager and DeepL client.
 */
const fileManager = await getFileManager(config.source);
const deeplClient = new DeepLClient(opts.authKey);

/**
 * Translate languages.
 */
for (const language of config.targets) {
	spinner.start(`Translating ${language.code}`);
	const output = await translate({
		client: deeplClient,
		config,
		fileManager,
		language,
		outDir: dirname(config.source),
	});

	spinner.stop(`Saved ${output}`);
}

p.outro("Done");
