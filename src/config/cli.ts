import { program } from "commander";

/**
 * Parses the CLI arguments.
 * @returns The parsed options.
 */
export function getOptions(): Options {
	return program
		.option("-k, --auth-key <KEY>", "DeepL auth key", process.env.DEEPL_AUTH_KEY)
		.option("-c, --config <PATH>", "Config file", "translations.config.json")
		.parse(process.argv)
		.opts<Options>();
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
