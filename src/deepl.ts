import type deepl from "deepl-node";
import { join } from "node:path";

import type { Configuration } from "./config/config.js";
import type { TargetLanguage } from "./config/target-language.js";
import type { TranslationFileHandler } from "./file-handlers/file-handler.js";

/**
 * Translates English text, and saves the output to a localized file.
 * @param opts Translation options.
 * @returns Output path where the translations were saved.
 */
export async function translateWithDeepL(opts: TranslateOptions): Promise<string> {
	const translations = await translate(opts);
	const { fileHandler, language, outDir } = opts;

	const path = language.file ?? join(outDir, `${language.code}${fileHandler.ext}`);
	await fileHandler.save(path, translations);

	return path;
}

/**
 * Translates the texts.
 * @param opts Translation options.
 * @returns Translated texts.
 */
async function translate(opts: TranslateOptions): Promise<string[]> {
	const { fileHandler, language } = opts;

	const texts: (string | undefined)[] = [];
	const pendingTexts: string[] = [];

	// Evaluate overrides to determine which text requires translating.
	fileHandler.translations().forEach((text) => {
		const override = language.overrides?.find((o) => o.text === text);
		if (override) {
			texts.push(override.out);
		} else {
			pendingTexts.push(text);
			texts.push(undefined);
		}
	});

	// Get the translated texts
	const translatedTexts = await getTranslatedTexts(pendingTexts, opts);

	// Aggregate the overrides and translated text.
	let i = 0;
	return texts.map((value) => {
		const text = value ?? translatedTexts.at(i++);
		if (text === undefined) {
			throw new Error(`Failed to map translation for ${language.code} at index ${i}. Please check overrides`);
		}

		return text;
	});
}

/**
 * Translates the specified texts with DeepL.
 * @param texts Texts to translate.
 * @param opts Translation options.
 * @returns Translated texts.
 */
async function getTranslatedTexts(texts: string[], opts: TranslateOptions): Promise<string[]> {
	if (texts.length === 0) {
		return [];
	}

	const { client, config, language } = opts;
	const res = await client.translateText(texts, "en", language.code, {
		glossary: language.glossary,
		formality: language.formality ?? config.formality,
	});

	return res.map((x) => x.text);
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
