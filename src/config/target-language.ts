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
	code: z.string(),
	file: z.optional(z.string()),
	formality: z.optional(Formality),
	glossary: z.optional(z.string()),
	overrides: z.optional(z.array(Override)),
});
