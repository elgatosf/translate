import type deepl from "deepl-node";
import { join } from "node:path";

import type { Configuration } from "./config/file.js";
import type { TargetLanguage } from "./config/target-language.js";
import type { TranslationFileHandler } from "./file-handlers/file-handler.js";

/**
 * Translates English text, and saves the output to a localized file.
 * @param param0 Translation options.
 * @param param0.client DeepL client.
 * @param param0.config The configuration.
 * @param param0.language Target language.
 * @param param0.outDir Output directory.
 * @param param0.fileHandler Translation file handler.
 * @returns Output path where the translations were saved.
 */
export async function translateWithDeepL({
	client,
	config,
	fileHandler,
	language,
	outDir,
}: TranslateOptions): Promise<string> {
	const result = await client.translateText(fileHandler.translations(), "en", language.code, {
		glossary: language.glossary,
		formality: language.formality ?? config.formality,
	});

	const path = language.file ?? join(outDir, `${language.code}${fileHandler.ext}`);
	await fileHandler.save(
		path,
		result.map((x) => x.text),
	);

	return path;
}

interface TranslateOptions {
	/**
	 * DeepL client responsible for translating.
	 */
	client: deepl.DeepLClient;

	/**
	 * The configuration.
	 */
	config: Configuration;

	/**
	 * Output directory where the translations will be saved.
	 */
	outDir: string;

	/**
	 * File handler capable of reading/writing translation text from/to files.
	 */
	fileHandler: TranslationFileHandler;

	/**
	 * Target language.
	 */
	language: TargetLanguage;
}
