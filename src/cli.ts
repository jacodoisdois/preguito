#!/usr/bin/env node

import { Command } from "commander";
import { registerCommitCommand } from "./commands/commit.js";
import { registerAmendPushCommands } from "./commands/amend-push.js";
import { registerRebaseCommands } from "./commands/rebase.js";
import { registerInitCommand } from "./commands/init.js";
import { registerConfigCommand } from "./commands/config.js";
import { registerPushCommands } from "./commands/push.js";
import { registerFixupCommand } from "./commands/fixup.js";
import { registerUndoCommand } from "./commands/undo.js";
import { registerStatusCommand } from "./commands/status.js";
import { registerSwitchCommand } from "./commands/switch.js";
import { registerStashCommands } from "./commands/stash.js";
import { registerLogCommand } from "./commands/log.js";
import { registerFindCommands } from "./commands/find.js";
import { registerDiffCommand } from "./commands/diff.js";

const program = new Command();

program
  .name("guito")
  .description("preguito - a lazy git CLI with commit templates and shortcuts")
  .version("0.1.0")
  .addHelpText(
    "before",
    "\n🦥 preguito v0.1.0\n   A lazy git CLI with commit templates and shortcuts.\n"
  );

registerCommitCommand(program);
registerAmendPushCommands(program);
registerRebaseCommands(program);
registerInitCommand(program);
registerConfigCommand(program);
registerPushCommands(program);
registerFixupCommand(program);
registerUndoCommand(program);
registerStatusCommand(program);
registerSwitchCommand(program);
registerStashCommands(program);
registerLogCommand(program);
registerFindCommands(program);
registerDiffCommand(program);

program.parse();
