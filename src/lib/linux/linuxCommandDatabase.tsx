import { linuxCmdsFileManagement } from "../../lib/linux/linuxCmdsFileManagement";
import { linuxCmdsTextProcessing } from "../../lib/linux/linuxCmdsTextProcessing";
import { linuxCmdsSystemProcess } from "../../lib/linux/linuxCmdsSystemProcess";
import { linuxCmdsNetworkComm } from "../../lib/linux/linuxCmdsNetworkComm";
import { linuxCmdsAdminSecurity } from "../../lib/linux/linuxCmdsAdminSecurity";
import { linuxCmdsMiscShell } from "../../lib/linux/linuxCmdsMiscShell";
import { linuxCmdsFileNavExtra } from "../../lib/linux/linuxCmdsFileNavExtra";
import { linuxCmdsSearching } from "../../lib/linux/linuxCmdsSearching";
import { linuxCmdsTextProcessingExtra } from "../../lib/linux/linuxCmdsTextProcessingExtra";
import { linuxCmdsCompressionExtra } from "../../lib/linux/linuxCmdsCompressionExtra";
import { linuxCmdsNewCommands } from "../../lib/linux/linuxCmdsNewCommands";
import { linuxCmdsAdvanced } from "../../lib/linux/linuxCmdsAdvanced";
import { linuxCmdExampleOutputs } from "../../lib/linux/linuxCmdExampleOutputs";
import { linuxCmdExampleOutputs2 } from "../../lib/linux/linuxCmdExampleOutputs2";
import { linuxCmdExampleOutputs3 } from "../../lib/linux/linuxCmdExampleOutputs3";
import { linuxCmdExampleOutputs4 } from "../../lib/linux/linuxCmdExampleOutputs4";
import { linuxCmdExampleOutputs5 } from "../../lib/linux/linuxCmdExampleOutputs5";
import { linuxCmdExampleOutputs6 } from "../../lib/linux/linuxCmdExampleOutputs6";
import { linuxCmdExampleOutputs7 } from "../../lib/linux/linuxCmdExampleOutputs7";
import { linuxCmdExampleVariants } from "../../lib/linux/linuxCmdExampleVariants";

import { CommandDef } from "../../lib/linux/CommandDef";
export type { CommandDef } from "../../lib/linux/CommandDef";

const allCommands: CommandDef[] = [
  ...linuxCmdsFileManagement,
  ...linuxCmdsTextProcessing,
  ...linuxCmdsSystemProcess,
  ...linuxCmdsNetworkComm,
  ...linuxCmdsAdminSecurity,
  ...linuxCmdsMiscShell,
  ...linuxCmdsFileNavExtra,
  ...linuxCmdsSearching,
  ...linuxCmdsTextProcessingExtra,
  ...linuxCmdsCompressionExtra,
  ...linuxCmdsNewCommands,
  ...linuxCmdsAdvanced,
];

export const linuxCommandDatabase: Record<string, CommandDef> = allCommands.reduce((acc, cmd) => {
  if (!acc[cmd.name]) {
    acc[cmd.name] = { ...cmd };
  }
  return acc;
}, {} as Record<string, CommandDef>);

for (const name in linuxCommandDatabase) {
  if (linuxCmdExampleOutputs[name]) {
    linuxCommandDatabase[name].exampleOutputLines = linuxCmdExampleOutputs[name];
  }
  if (linuxCmdExampleOutputs2[name]) {
    linuxCommandDatabase[name].exampleOutputLines = linuxCmdExampleOutputs2[name];
  }
  if (linuxCmdExampleOutputs3[name]) {
    linuxCommandDatabase[name].exampleOutputLines = linuxCmdExampleOutputs3[name];
  }
  if (linuxCmdExampleOutputs4[name]) {
    linuxCommandDatabase[name].exampleOutputLines = linuxCmdExampleOutputs4[name];
  }
  if (linuxCmdExampleOutputs5[name]) {
    linuxCommandDatabase[name].exampleOutputLines = linuxCmdExampleOutputs5[name];
  }
  if (linuxCmdExampleOutputs6[name]) {
    linuxCommandDatabase[name].exampleOutputLines = linuxCmdExampleOutputs6[name];
  }
  if (linuxCmdExampleOutputs7[name]) {
    linuxCommandDatabase[name].exampleOutputLines = linuxCmdExampleOutputs7[name];
  }
}

for (const name in linuxCommandDatabase) {
  if (linuxCmdExampleVariants[name]) {
    linuxCommandDatabase[name].exampleOutputVariants = linuxCmdExampleVariants[name];
  }
}