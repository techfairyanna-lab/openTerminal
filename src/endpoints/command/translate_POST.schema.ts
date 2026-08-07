import { z } from "zod";
import superjson from "superjson";
// import { authenticatedFetch } from "../../client/lib/authenticatedFetch";

export const commandTranslateSchema = z.object({
  command: z.string().min(1, "Command cannot be empty"),
});

export type InputType = z.infer<typeof commandTranslateSchema>;

export type SyntaxPartType = 
  | "command"
  | "flag"
  | "argument"
  | "operator"
  | "path"
  | "variable"
  | "pipe"
  | "redirect"
  | "other";

export type OutputType = {
  explanation: string;
  syntaxBreakdown: Array<{
    part: string;
    type: SyntaxPartType;
    description: string;
  }>;
  useCases: string[];
  exampleOutput: Array<{
    segments: Array<{
      text: string;
      explanation: string;
    }>;
  }>;
  isDangerous: boolean;
  dangerWarning: string | null;
  safeAlternatives: string[];
  isPartialCommand: boolean;
  completionSuggestions: string[];
  isFromCheatSheet?: boolean;
  cheatSheetContent?: string | null;
  commandNotInDatabase?: boolean;
};

export const postCommandTranslate = async (
  body: InputType,
  init?: RequestInit
): Promise<OutputType> => {
  const validatedInput = commandTranslateSchema.parse(body);
  // const result = await authenticatedFetch(`/_api/command/translate`, {
  const result = await fetch(`/api/command/translate`, {
    method: "POST",
    body: superjson.stringify(validatedInput),
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!result.ok) {
    let errorMessage = "Unknown error";
    try {
      const errorObject = superjson.parse<{ error: string }>(await result.text());
      errorMessage = errorObject.error;
    } catch {
      errorMessage = `Server returned ${result.status}`;
    }
    throw new Error(errorMessage);
  }

  return superjson.parse<OutputType>(await result.text());
};