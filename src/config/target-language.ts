import type { TargetLanguageCode } from "deepl-node";
import { z } from "zod/mini";

import { Formality } from "./formality.js";

/**
 * Configuration for a target language.
 */
export type TargetLanguage = z.infer<typeof TargetLanguage>;

/**
 * Configuration for an override within a specific language.
 */
const Override = z.pipe(
	z.object({
		text: z.string(),
		out: z.optional(z.string()),
	}),
	z.transform(({ text, out }) => {
		return {
			text,
			out: out ?? text,
		};
	}),
);

/**
 * Configuration for a target language.
 */
export const TargetLanguage = z.object({
	code: z.enum([
		"ar",
		"bg",
		"cs",
		"da",
		"de",
		"el",
		"en-GB",
		"en-US",
		"es",
		"et",
		"fi",
		"fr",
		"he",
		"hu",
		"id",
		"it",
		"ja",
		"ko",
		"lt",
		"lv",
		"nb",
		"nl",
		"pl",
		"pt-BR",
		"pt-PT",
		"ro",
		"ru",
		"sk",
		"sl",
		"sv",
		"th",
		"tr",
		"uk",
		"vi",
		"zh",
		"zh-HANS",
		"zh-HANT",
	] as const satisfies readonly TargetLanguageCode[]),
	file: z.optional(z.string()),
	formality: z.optional(Formality),
	glossary: z.optional(z.string()),
	overrides: z.optional(z.array(Override)),
});
