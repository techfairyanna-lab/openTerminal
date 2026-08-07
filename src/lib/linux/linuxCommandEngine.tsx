import type { OutputType as TranslateOutputType, SyntaxPartType } from "../../endpoints/command/translate_POST.schema";
import type { OutputType as FindOutputType } from "../../endpoints/command/find_POST.schema";
import { linuxCommandDatabase } from "./linuxCommandDatabase";

function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuotes: string | null = null;
  let nestingLevel = 0; // for $() subshells

  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    const nextChar = command[i + 1] || "";

    if (inQuotes) {
      current += char;
      if (char === inQuotes) inQuotes = null;
    } else if (char === "$" && nextChar === "(") {
      current += "$(";
      nestingLevel++;
      i++;
    } else if (char === "(" && nestingLevel > 0) {
      current += "(";
      nestingLevel++;
    } else if (char === ")" && nestingLevel > 0) {
      current += ")";
      nestingLevel--;
    } else if ((char === '"' || char === "'") && nestingLevel === 0) {
      inQuotes = char;
      current += char;
    } else if (nestingLevel > 0) {
      current += char;
    } else if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else if ("|;<>&".includes(char)) {
      if (current && !(current === "2" && char === ">")) {
        tokens.push(current);
        current = "";
      }
      
      if (char === "&" && nextChar === "&") { tokens.push("&&"); i++; }
      else if (char === "|" && nextChar === "|") { tokens.push("||"); i++; }
      else if (char === ">" && nextChar === ">") { tokens.push(">>"); i++; }
      else if (char === "<" && nextChar === "<") { tokens.push("<<"); i++; }
      else if (char === "&" && nextChar === ">") { tokens.push("&>"); i++; }
      else if (current === "2" && char === ">") { tokens.push("2>"); current = ""; }
      else { tokens.push(char); }
    } else {
      current += char;
    }
  }

  if (current) tokens.push(current);
  return tokens;
}

export const linuxCommandEngine = {
  translate(command: string): TranslateOutputType {
    const tokens = tokenize(command.trim());
    
    const result: TranslateOutputType = {
      explanation: "",
      syntaxBreakdown: [],
      useCases: [],
      exampleOutput: [],
      isDangerous: false,
      dangerWarning: null,
      safeAlternatives: [],
      isPartialCommand: false,
      completionSuggestions: [],
      isFromCheatSheet: false,
      cheatSheetContent: null,
      commandNotInDatabase: false,
    };

    if (tokens.length === 0) {
      result.explanation = "Empty command string.";
      return result;
    }

    // Special check for fork bomb literal (spaces usually omitted or varies, simple exact match fallback)
    if (command.replace(/\s+/g, "") === ":(){:|:&};:") {
      const dbEntry = linuxCommandDatabase[":(){ :|:& };:"];
      if (dbEntry) {
        result.explanation = dbEntry.description;
        result.isDangerous = dbEntry.isDangerous;
        result.dangerWarning = dbEntry.dangerWarning;
        result.useCases = dbEntry.useCases;
        result.safeAlternatives = dbEntry.safeAlternatives;
        return result;
      }
    }

    let isCommandExpected = true;
    let baseCommandContext = "";
    const explanations: string[] = [];
    const baseCommands: string[] = [];
    
    let firstActualCmd = "";
    let firstCommandFlags: string[] = [];
    let collectingFlags = true;

    // Track tokens to contextualize danger (like rm with -rf or chmod with 777)
    let seenRm = false;
    let seenRmR = false;
    let seenRmF = false;
    let seenChmod = false;
    let seen777 = false;

    tokens.forEach((token, index) => {
      let type: SyntaxPartType = "other";
      let description = "";

      // Check special context logic
      if (token === "rm") seenRm = true;
      if (seenRm && (token === "-rf" || token === "-fr")) {
        seenRmR = true;
        seenRmF = true;
      }
      if (seenRm && (token === "-r" || token === "-R")) seenRmR = true;
      if (seenRm && token === "-f") seenRmF = true;
      if (token === "chmod") seenChmod = true;
      if (seenChmod && token.includes("777")) seen777 = true;

      if (["|", "||", "&&", ";"].includes(token)) {
        type = token === "|" ? "pipe" : "operator";
        description = type === "pipe" 
          ? "Passes the output of the previous command to the next one" 
          : "Control operator linking multiple commands";
        isCommandExpected = true;
        baseCommandContext = "";
        collectingFlags = false;
      } else if (["<", ">", ">>", "2>", "&>"].includes(token)) {
        type = "redirect";
        description = "Redirects standard input, output, or error streams";
      } else if (isCommandExpected) {
        // Evaluate command
        if (token === "sudo" && index < tokens.length - 1) {
          type = "command";
          description = linuxCommandDatabase["sudo"]?.description || "Execute a command as superuser";
          baseCommands.push("sudo");
          explanations.push(description);
          // sudo doesn't reset isCommandExpected because next token is also a command
        } else {
          type = "command";
          isCommandExpected = false;
          baseCommandContext = token;
          baseCommands.push(token);
          if (!firstActualCmd) {
            firstActualCmd = token;
          }

          const dbEntry = linuxCommandDatabase[token];
          if (dbEntry) {
            description = dbEntry.description;
            explanations.push(dbEntry.description);

            // Inherit traits of first recognized command
            if (result.useCases.length === 0) {
              result.useCases = dbEntry.useCases;
              result.exampleOutput = dbEntry.exampleOutputLines;
            }

            // Aggregate danger warnings
            if (dbEntry.isDangerous) {
              result.isDangerous = true;
              if (dbEntry.dangerWarning) {
                result.dangerWarning = result.dangerWarning 
                  ? result.dangerWarning + " | " + dbEntry.dangerWarning 
                  : dbEntry.dangerWarning;
              }
              if (dbEntry.safeAlternatives) {
                result.safeAlternatives.push(...dbEntry.safeAlternatives);
              }
            }
          } else {
            description = `Executes the program or utility '${token}'`;
            if (explanations.length === 0) {
              explanations.push(`A custom or external program named ${token}`);
            }
            // Mark command as not found in local database
            if (token !== "sudo") {
              result.commandNotInDatabase = true;
            }
          }
        }
      } else if (token.startsWith("-")) {
        type = "flag";
        description = "Modifies the behavior of the command";
        if (collectingFlags && baseCommandContext === firstActualCmd) {
          firstCommandFlags.push(token);
        }
        const dbEntry = linuxCommandDatabase[baseCommandContext];
        if (dbEntry && dbEntry.flags[token]) {
          description = dbEntry.flags[token].description;
        } else if (dbEntry) {
           // Heuristically try combining flag explanations for -aux, -alF, etc.
           let comboDescription = "";
           for (let c of token.replace(/^-+/, "")) {
              if (dbEntry.flags[`-${c}`]) {
                comboDescription += `${c}: ${dbEntry.flags[`-${c}`].description}. `;
              }
           }
           if (comboDescription) description = comboDescription.trim();
        }
      } else if (token.includes("=") || token.startsWith("$")) {
        type = "variable";
        description = "Environment variable assignment or substitution";
      } else if (token.includes("/") || token.startsWith(".") || token.startsWith("~")) {
        type = "path";
        description = "A file or directory path";
      } else {
        type = "argument";
        description = "Parameters passed to the command or flags";
        if (collectingFlags && baseCommandContext === firstActualCmd) {
           const dbEntry = linuxCommandDatabase[firstActualCmd];
           if (dbEntry?.exampleOutputVariants?.[token]) {
             firstCommandFlags.push(token);
           }
        }
      }

      result.syntaxBreakdown.push({ part: token, type, description });
    });

    // Example Output Variant Selection
    if (firstActualCmd) {
      const dbEntry = linuxCommandDatabase[firstActualCmd];
      if (dbEntry && dbEntry.exampleOutputVariants && firstCommandFlags.length > 0) {
        const sortedFlags = [...firstCommandFlags].sort().join(" ");
        let matchedVariant = dbEntry.exampleOutputVariants[sortedFlags];
        
        if (!matchedVariant) {
          for (const flag of firstCommandFlags) {
            if (dbEntry.exampleOutputVariants[flag]) {
              matchedVariant = dbEntry.exampleOutputVariants[flag];
              break;
            }
          }
        }

        if (!matchedVariant) {
          // Decompose all flags into individual characters for partial matching
          const inputChars = new Set<string>();
          for (const flag of firstCommandFlags) {
            if (flag.startsWith("-")) {
              const chars = flag.replace(/^-+/, '');
              for (const c of chars) inputChars.add(c);
            } else {
              // BSD-style positional arg like "aux" - keep as-is for matching
              inputChars.add(flag);
            }
          }
          
          // Find the variant key whose decomposed chars are the largest subset of inputChars
          let bestScore = 0;
          for (const [variantKey, variantOutput] of Object.entries(dbEntry.exampleOutputVariants!)) {
            const variantChars = new Set<string>();
            if (variantKey.startsWith("-")) {
              for (const c of variantKey.replace(/^-+/, '')) variantChars.add(c);
            } else {
              variantChars.add(variantKey);
            }
            
            // Check if ALL variant key chars exist in the input chars (variant is a subset of input)
            let allMatch = true;
            for (const vc of variantChars) {
              if (!inputChars.has(vc)) { allMatch = false; break; }
            }
            
            // Pick the largest matching subset (most specific match)
            if (allMatch && variantChars.size > bestScore) {
              bestScore = variantChars.size;
              matchedVariant = variantOutput;
            }
          }
        }
        
        if (matchedVariant) {
          result.exampleOutput = matchedVariant;
        }
      }
    }

    // Build the synthesized explanation
    if (explanations.length > 0) {
      if (explanations.length === 1) {
        result.explanation = explanations[0];
      } else {
        result.explanation = "Pipeline/Combination: " + explanations.join(" -> ");
      }
    } else {
      result.explanation = "Unknown or unsupported command format.";
    }

    // Danger heuristics overrides
    if (seenRm && seenRmR && seenRmF) {
      result.isDangerous = true;
      result.dangerWarning = "WARNING: You are force-deleting recursively. This completely wipes out directories permanently without any prompts. Extreme caution required.";
      result.safeAlternatives.push("Consider using mv (move) to a trash folder, or removing -f to get prompts.");
    }
    if (seenChmod && seen777) {
      result.isDangerous = true;
      result.dangerWarning = "WARNING: 'chmod 777' gives everyone (owner, group, and public) full read/write/execute access. This is incredibly insecure and rarely necessary.";
      result.safeAlternatives.push("chmod 755 (for directories/scripts)", "chmod 644 (for normal files)");
    }
    
    result.safeAlternatives = [...new Set(result.safeAlternatives)];

    // Check for partial completion
    const lastToken = tokens[tokens.length - 1];
    if (["|", "<", ">", ">>", "&&", "||"].includes(lastToken)) {
      result.isPartialCommand = true;
      result.completionSuggestions = ["(Add a subsequent command or file path here)"];
    } else if (baseCommands.length > 0) {
      const lastCmd = baseCommands[baseCommands.length - 1];
      const requiresArgs = ["cd", "cp", "mv", "rm", "cat", "grep", "mkdir", "touch", "less"];
      
      // Determine if there are arguments after the command
      const hasArgs = tokens.some((t, idx) => 
        idx > tokens.lastIndexOf(lastCmd) && !t.startsWith("-") && t !== "sudo" && !["|", ">", "<", ">>"].includes(t)
      );

      if (requiresArgs.includes(lastCmd) && !hasArgs) {
        result.isPartialCommand = true;
        const dbEntry = linuxCommandDatabase[lastCmd];
        if (dbEntry) {
           // Provide basic flags as suggestions
           result.completionSuggestions = Object.keys(dbEntry.flags).slice(0, 3);
           result.completionSuggestions.push("<target path/file>");
        }
      }
    }

    return result;
  },

  find(description: string): FindOutputType {
    const rawTokens = description.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/\s+/);
    const stopWords = new Set(["how", "to", "do", "i", "the", "a", "an", "in", "my", "all", "can", "want", "for", "of", "and", "is", "it", "with", "what", "which", "where", "on", "from", "show", "me", "get"]);
    const keywords = rawTokens.filter(t => t.length > 1 && !stopWords.has(t));

    if (keywords.length === 0) {
      return {
        commands: [
          {
            command: "man",
            explanation: "Read manual pages.",
            pros: "Provides documentation. Try being more specific with your keywords."
          }
        ]
      };
    }

    type ScoredCommand = { cmd: string; score: number };
    const scores: ScoredCommand[] = [];

    for (const [name, entry] of Object.entries(linuxCommandDatabase)) {
      let score = 0;

      for (const kw of keywords) {
        // Exact name match
        if (name === kw) score += 10;
        else if (name.includes(kw)) score += 5;

        // Description match
        if (entry.description.toLowerCase().includes(kw)) score += 4;
        
        // Category match
        if (entry.category.toLowerCase().includes(kw)) score += 3;

        // Use cases match
        entry.useCases.forEach(uc => {
          if (uc.toLowerCase().includes(kw)) score += 2;
        });

        // Flag description match
        Object.values(entry.flags).forEach(flag => {
          if (flag.description.toLowerCase().includes(kw)) score += 1;
        });
      }

      if (score > 0) {
        scores.push({ cmd: name, score });
      }
    }

    // Sort by descending score
    scores.sort((a, b) => b.score - a.score);

    // Filter to top 3
    const topMatches = scores.slice(0, 3);

    if (topMatches.length === 0) {
      return {
        commands: [
          {
            command: "apropos " + keywords.join(" "),
            explanation: "Searches the manual page names and descriptions.",
            pros: "Useful when you don't know the exact command but know what it relates to."
          }
        ]
      };
    }

    return {
      commands: topMatches.map(match => {
        const dbEntry = linuxCommandDatabase[match.cmd];
        return {
          command: dbEntry.name,
          explanation: dbEntry.description,
          pros: `Strongly aligns with your request (Score: ${match.score}). ${dbEntry.useCases[0] || ""}`,
        };
      })
    };
  }
};