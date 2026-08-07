import { CommandDef } from "./CommandDef";
import { linuxCmdsTextProcessingFormat } from "./linuxCmdsTextProcessingFormat";
import { linuxCmdsTextProcessingData } from "./linuxCmdsTextProcessingData";
import { linuxCmdsTextProcessingTerminal } from "./linuxCmdsTextProcessingTerminal";

export const linuxCmdsTextProcessingExtra: CommandDef[] = [
  ...linuxCmdsTextProcessingFormat,
  ...linuxCmdsTextProcessingData,
  ...linuxCmdsTextProcessingTerminal,
];