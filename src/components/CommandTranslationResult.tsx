import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { Separator } from "./Separator";
import { OutputType as CommandTranslateOutput } from "../endpoints/command/translate_POST.schema";
import styles from "./CommandTranslationResult.module.css";

const getTypeColor = (type: string) => {
  switch (type) {
    case "command":
      return "var(--chart-color-1)";
    case "flag":
      return "var(--chart-color-2)";
    case "argument":
    case "path":
      return "var(--chart-color-3)";
    case "variable":
      return "var(--chart-color-4)";
    case "operator":
    case "pipe":
    case "redirect":
      return "var(--chart-color-5)";
    default:
      return "var(--muted-foreground)";
  }
};

export interface CommandTranslationResultProps {
  result: CommandTranslateOutput;
}

export const CommandTranslationResult: React.FC<CommandTranslationResultProps> = ({ result }) => {
  return (
    <div className={styles.translationCard}>
      {result.isFromCheatSheet && (
        <div className={styles.warningAlert}>
          <Info size={20} className={styles.warningIcon} />
          <div>
            This command isn't in our database yet — showing community cheat sheet.
          </div>
        </div>
      )}

      <div className={styles.translationSection}>
        <h4 className={styles.translationTitle}>Syntax Breakdown</h4>
        <div className={styles.tokenDisplay}>
          {result.syntaxBreakdown.map((part, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={styles.token}
                  style={{
                    color: getTypeColor(part.type),
                    borderColor: getTypeColor(part.type)
                  }}
                >
                  {part.part}
                </button>
              </TooltipTrigger>
              <TooltipContent className={styles.tooltipContent}>
                <div className={styles.tokenTooltip}>
                  <strong style={{ color: getTypeColor(part.type) }}>
                    {part.type}
                  </strong>
                  <p>{part.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className={styles.breakdownList}>
          {result.syntaxBreakdown.map((part, i) => (
            <div key={i} className={styles.breakdownItem}>
              <div
                className={styles.breakdownTerm}
                style={{ color: getTypeColor(part.type) }}
              >
                {part.part}
              </div>
              <div className={styles.breakdownDetails}>
                <span className={styles.breakdownType}>{part.type}</span>
                <span className={styles.breakdownDesc}>{part.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className={styles.sectionSeparator} />

      <div className={styles.translationSection}>
        <h4 className={styles.translationTitle}>Explanation</h4>
        <p className={styles.translationText}>{result.explanation}</p>
      </div>

      {result.cheatSheetContent && (
        <>
          <Separator className={styles.sectionSeparator} />
          <div className={styles.translationSection}>
            <h4 className={styles.translationTitle}>Community Cheat Sheet</h4>
            <pre className={styles.cheatSheetPre}>{result.cheatSheetContent}</pre>
          </div>
        </>
      )}

      {result.isDangerous && result.dangerWarning && (
        <div className={styles.dangerAlert}>
          <ShieldCheck size={20} className={styles.dangerIcon} />
          <div>
            <strong>Danger: </strong>
            {result.dangerWarning}
          </div>
        </div>
      )}
    </div>
  );
};