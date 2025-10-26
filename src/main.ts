#!/usr/bin/env node
import { program } from "commander";

import { init } from "./commands/init.js";
import { translate } from "./commands/translate.js";
import { DEFAULT_CONFIG_PATH } from "./config/config.js";

program.command("init").description("Initialize a configuration file").action(init);

program
	.option("-k, --auth-key <KEY>", "DeepL auth key", process.env.DEEPL_AUTH_KEY)
	.option("-c, --config <PATH>", "Config file", DEFAULT_CONFIG_PATH)
	.action(translate)
	.parse(process.argv);
