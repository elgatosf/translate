import type deepl from "deepl-node";
import { z } from "zod/mini";

export const Formality = z.enum([
	"less",
	"default",
	"more",
	"prefer_less",
	"prefer_more",
] as const satisfies readonly deepl.Formality[]);
