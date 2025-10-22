import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Writes the contents to the specified file.
 * @param file Path to the file.
 * @param contents File contents.
 */
export async function write(file: string, contents: string): Promise<void> {
	const dir = dirname(file);
	if (!existsSync(dir)) {
		await mkdir(dir);
	}

	await writeFile(file, contents, { encoding: "utf-8" });
}
