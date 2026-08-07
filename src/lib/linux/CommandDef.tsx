export interface CommandDef {
  name: string;
  description: string;
  useCases: string[];
  isDangerous: boolean;
  dangerWarning: string | null;
  safeAlternatives: string[];
  flags: Record<string, { description: string }>;
  exampleOutputLines: Array<{
    line: string;
    segments: Array<{ text: string; explanation: string }>;
  }>;
  exampleOutputVariants?: Record<
    string,
    Array<{
      line: string;
      segments: Array<{ text: string; explanation: string }>;
    }>
  >;
  relatedCommands: string[];
  category: string;
}