import { CommandDef } from "./CommandDef";
import { linuxCmdsCompression } from "./linuxCmdsCompression";
import { linuxCmdsDisk } from "./linuxCmdsDisk";
import { linuxCmdsShell } from "./linuxCmdsShell";

// Combines the newly split command files back into the single array to maintain backwards compatibility
export const linuxCmdsMiscShell: CommandDef[] = [
  ...linuxCmdsCompression,
  ...linuxCmdsDisk,
  ...linuxCmdsShell,
];