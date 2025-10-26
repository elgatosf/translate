import { extname } from "node:path";

import { createJsonFileHandler } from "./json.js";
import { createReswFileHandler } from "./resw.js";

/**
 * Gets the file handler for the specified file.
 * @param path Path to the English translations.
 * @returns The file handler.
 */
export async function getFileHandler(path: string): Promise<TranslationFileHandler> {
	const ext = extname(path).toLowerCase();
	if (ext === ".json") {
		return await createJsonFileHandler(path);
	}

	if (ext === ".resw") {
		return await createReswFileHandler(path);
	}

	throw new Error(`Unsupported file extension ${ext}, please specify a .json or .resw file`);
}

/**
 * File handler capable of reading/writing translation text from/to files.
 */
export interface TranslationFileHandler {
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
