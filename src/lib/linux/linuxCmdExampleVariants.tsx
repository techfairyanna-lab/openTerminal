import { ExampleOutputLine } from "./linuxCmdExampleOutputs";
import { psVariants } from "./linuxCmdExampleVariantsPs";
import { lsVariants } from "./linuxCmdExampleVariantsLs";
import { netstatVariants } from "./linuxCmdExampleVariantsNetstat";
import { dfVariants, duVariants, freeVariants, grepVariants, lsblkVariants } from "./linuxCmdExampleVariantsOther";
import { advancedVariants } from "./linuxCmdExampleVariantsAdvanced";

export const linuxCmdExampleVariants: Record<string, Record<string, ExampleOutputLine[]>> = {
  ps: psVariants,
  ls: lsVariants,
  df: dfVariants,
  du: duVariants,
  free: freeVariants,
  netstat: netstatVariants,
  grep: grepVariants,
  lsblk: lsblkVariants,
  ...advancedVariants
};