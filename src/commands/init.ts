import * as p from "@clack/prompts";
import { existsSync } from "node:fs";
import { extname } from "node:path";

import { type Configuration, DEFAULT_CONFIG_PATH } from "../config/file.js";
import type { TargetLanguage } from "../config/target-language.js";
import { write } from "../io.js";

/**
 * Initialization wizard for creating a new configuration file.
 */
export async function init(): Promise<void> {
	p.intro("Initializing");

	const config = await promptConfig();
	const file = await getConfigPath();

	await write(file, JSON.stringify(config, null, "    "));

	p.outro(`Saved to ${file}`);
}

/**
 * Prompts the user for their preferred configuration options.
 * @returns The configuration.
 */
async function promptConfig(): Promise<Configuration> {
	const opts = await p.group(
		{
			source: () =>
				p.text({
					message: "Source text file:",
					placeholder: "Path to .json or .resx file",
					validate: validateSourcePath,
				}),
			targets: () =>
				p.multiselect({
					message: "Target languages:",
					options: getTargetOptions(),
				}),
		},
		{
			onCancel: () => {
				p.cancel("Aborted.");
				process.exit(0);
			},
		},
	);

	return {
		source: opts.source,
		targets: opts.targets.map((code) => ({ code }) as TargetLanguage),
	};
}

/**
 * Prompts the user for their preferred configuration file path.
 * @returns The configuration path.
 */
async function getConfigPath(): Promise<string> {
	if (!existsSync(DEFAULT_CONFIG_PATH)) {
		return DEFAULT_CONFIG_PATH;
	}

	const path = await p.text({
		message: "Save configuration file to:",
		validate: (value: string): string | undefined => {
			if (existsSync(value)) {
				return "File already exists";
			}
		},
	});

	if (p.isCancel(path)) {
		p.cancel("Aborted.");
		process.exit(0);
	}

	return path;
}

/**
 * Validates the specified source path.
 * @param value The value.
 * @returns Error message; otherwise `undefined`.
 */
function validateSourcePath(value: string): string | undefined {
	if (!existsSync(value)) {
		return "File not found, file must be a .json or .resw file";
	}

	const ext = extname(value);
	if (ext !== ".json" && ext !== ".resw") {
		return "File must be a .json or .resw file";
	}
}

/**
 * Gets the available target options.
 * @returns Target options.
 */
function getTargetOptions(): p.Option<string>[] {
	return [
		{
			label: "Chinese (Simplified)",
			value: "zh-HANS",
		},
		{
			label: "Chinese (Traditional)",
			value: "zh-HANT",
		},
		{
			label: "Danish",
			value: "da",
		},
		{
			label: "Dutch",
			value: "nl",
		},
		{
			label: "French",
			value: "fr",
		},
		{
			label: "German",
			value: "de",
		},
		{
			label: "Italian",
			value: "it",
		},
		{
			label: "Japanese",
			value: "ja",
		},
		{
			label: "Korean",
			value: "ko",
		},
		{
			label: "Portuguese",
			value: "pt",
		},
		{
			label: "Portuguese (Brazil)",
			value: "pt-BR",
		},
		{
			label: "Portuguese (Portugal)",
			value: "pt-PT",
		},
		{
			label: "Russian",
			value: "ru",
		},
		{
			label: "Spanish",
			value: "es",
		},
		{
			label: "Swedish",
			value: "sv",
		},
	];
}
