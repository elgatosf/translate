import _ from "lodash";
import { readFile } from "node:fs/promises";

import { write } from "../io.js";
import type { TranslationFileHandler } from "./file-handler.js";

/**
 * File handler capable of reading/writing translation text from/to JSON files.
 */
class JsonFileHandler implements TranslationFileHandler {
	/**
	 * @inheritdoc
	 */
	public ext = ".json";

	/**
	 * Map of the English translations.
	 */
	private _translations = new Map<string, JsonTranslation>();

	/**
	 * Initializes a new instance of the {@link JsonFileHandler} class.
	 * @param source The English translations.s
	 */
	constructor(source: object) {
		this.visit(source, []);
	}

	/**
	 * @inheritdoc
	 */
	public async save(path: string, translations: string[]): Promise<void> {
		const obj = {};
		let i = 0;
		for (const source of this._translations.values()) {
			const text = translations.at(i) ?? {};
			if (text) {
				_.set(obj, source.path, text);
				i++;
			}
		}

		await write(path, JSON.stringify(obj, undefined, "    "));
	}

	/**
	 * @inheritdoc
	 */
	public translations(): string[] {
		return Array.from(this._translations.values().map(({ text }) => text));
	}

	/**
	 * Traverses the English translations and flattens them.
	 * @param source The source object.
	 * @param breadcrumbs Breadcrumbs used to store the key-path of the translation.
	 */
	private visit(source: object, breadcrumbs: string[]): void {
		Object.entries(source).forEach(([key, value]) => {
			const path = [...breadcrumbs, key];

			switch (typeof value) {
				case "object":
					this.visit(value, path);
					break;

				case "string":
					this._translations.set(path.join("."), {
						path,
						text: value,
					});
					break;

				default:
					throw new Error(`Invalid value type: ${typeof value}`);
			}
		});
	}
}

/**
 * Creates a JSON translation file handler.
 * @param path Path to the JSON file that contains the English translations.
 * @returns The file handler.
 */
export async function createJsonFileHandler(path: string): Promise<TranslationFileHandler> {
	const json = await readFile(path, { encoding: "utf-8" });
	return new JsonFileHandler(JSON.parse(json));
}

/**
 * Translation within a JSON file.
 */
interface JsonTranslation {
	/**
	 * Path to the string.
	 */
	path: string[];

	/**
	 * The translation text.
	 */
	text: string;
}
