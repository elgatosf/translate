import { extname } from "node:path";

import { createJsonFileManager } from "./file-managers/json.js";
import { createReswFileManager } from "./file-managers/resw.js";

/**
 * Gets the file manager capable of handling translations for the specified file.
 * @param path Path to the English translations.
 * @returns The file manager.
 */
export async function getFileManager(path: string): Promise<TranslationFileManager> {
	const ext = extname(path).toLowerCase();
	if (ext === ".json") {
		return await createJsonFileManager(path);
	}

	if (ext === ".resw") {
		return await createReswFileManager(path);
	}

	throw new Error(`Unsupported file extension: ${ext}`);
}

/**
 * File manager responsible for reading and writing translation files.
 */
export interface TranslationFileManager {
	/**
	 * File extension the translation parser supports.
	 */
	ext: string;

	/**
	 * Saves the translations to disk.
	 * @param path Path to save the translations to.
	 * @param translations Translated texts.
	 */
	save(path: string, translations: string[]): Promise<void>;

	/**
	 * Gets the English translations.
	 * @returns The translations.
	 */
	translations(): string[];
}
