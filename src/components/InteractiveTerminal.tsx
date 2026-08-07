import React, { useState, useRef, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { CommandTranslationResult } from "./CommandTranslationResult";
import { OutputType as CommandTranslateOutput } from "../endpoints/command/translate_POST.schema";
import { executeCommand, getPrompt, getCompletions, saveFileContent, getAllSimulatedFiles } from "./terminalSimulator";
import { NanoEditor } from "./NanoEditor";
import styles from "./InteractiveTerminal.module.css";

// Helper to convert Linux ANSI color codes into React CSS styles
const renderColoredText = (text: string) => {
  const parts = text.split(/(\x1b\[[0-9;]*m)/);
  let currentColor = "";
  let currentWeight: "normal" | "bold" = "normal";
  
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("\x1b[")) {
      if (part.includes("34")) currentColor = "#005fd7";       // Directory Blue
      else if (part.includes("32")) currentColor = "#00a600";  // Executable Green
      else if (part.includes("31")) currentColor = "#cc0000";  // Archive Red
      else if (part.includes("35")) currentColor = "#a900af";  // Image Magenta
      else if (part.includes("36")) currentColor = "#00a6b2";  // Audio Cyan
      
      if (part.includes("01")) currentWeight = "bold";
      if (part === "\x1b[0m") {
        currentColor = "";
        currentWeight = "normal";
      }
      return null;
    }
    return (
      <span key={i} style={{ color: currentColor || "inherit", fontWeight: currentWeight }}>
        {part}
      </span>
    );
  });
};

interface Segment {
  text: string;
  explanation: string;
}

interface OutputLine {
  segments: Segment[];
}

export interface TerminalEntry {
  command: string;
  output: OutputLine[];
  breakdown?: CommandTranslateOutput;
  simulated?: boolean;
}

export interface InteractiveTerminalProps {
  entries: TerminalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TerminalEntry[]>>;
  onCommandSubmit: (command: string, isSimulated?: boolean) => void;
  isProcessing?: boolean;
  promptHint?: string;
  disabled?: boolean;
  className?: string;
  username?: string;
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  entries,
  setEntries,
  onCommandSubmit,
  isProcessing = false,
  promptHint,
  disabled = false,
  className,
  username,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [editorState, setEditorState] = useState<{ filename: string; absPath: string; content: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const allEntries = entries;
  const latestEntry = allEntries.length > 0 ? allEntries[allEntries.length - 1] : null;
  const prompt = getPrompt();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [allEntries, isProcessing]);

  useEffect(() => {
    if (!isProcessing && !disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [allEntries, isProcessing, disabled]);

  const executeTerminalCommand = (cmd: string) => {
    const result = executeCommand(cmd);

    if (result === null) {
      setEntries(prev => [...prev, { command: cmd, output: [], simulated: true }]);
      return;
    }

    if (result.type === "clear") {
      onCommandSubmit(cmd, true); // true = simulated
      setEntries([]);
      return;
    }

    if (result.type === "exit") {
      onCommandSubmit(cmd, true); // true = simulated
      setEntries(prev => [...prev, {
        command: cmd,
        output: [{ segments: [{ text: "logout", explanation: "" }] }],
        simulated: true,
      }]);
      return;
    }

    if (result.type === "nano") {
      setEditorState({ filename: result.filename, absPath: result.absPath, content: result.content });
      return;
    }

    if (result.type === "download") {
      const blob = new Blob([result.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setEntries(prev => [...prev, {
        command: cmd,
        output: [{ segments: [{ text: `Downloaded ${result.filename} to your device.`, explanation: "" }] }],
        simulated: true,
      }]);
      return;
    }

    if (result.type === "export") {
      const files = getAllSimulatedFiles();
      if (files.length === 0) {
        setEntries(prev => [...prev, { command: cmd, output: [{ segments: [{ text: "No files to export.", explanation: "" }] }], simulated: true }]);
        return;
      }
      let exportContent = `# Terminal File System Export\n# Generated: ${new Date().toLocaleString()}\n\n`;
      files.forEach(f => {
        exportContent += `=== ${f.name} ===\n${f.content}\n\n`;
      });
      
      const blob = new Blob([exportContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "terminal_export.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setEntries(prev => [...prev, {
        command: cmd,
        output: [{ segments: [{ text: `Exported ${files.length} files to terminal_export.txt`, explanation: "" }] }],
        simulated: true,
      }]);
      return;
    }

    if (result.type === "output" || result.type === "error" || result.type === "info") {
      const outputLines = (result.text || "").split("\n").map(lineText => ({
        segments: [{ text: lineText, explanation: "" }]
      }));
      setEntries(prev => [...prev, { command: cmd, output: outputLines, simulated: true }]);
      
      // FIX: Still send to API for breakdown even if simulated
      onCommandSubmit(cmd, true); // true = simulated
      return;
    }

    // not handled by simulator — send to API for breakdown
    onCommandSubmit(cmd, false); // false = not simulated
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab Autocompletion
    if (e.key === "Tab") {
      e.preventDefault();
      const completions = getCompletions(inputValue);
      if (completions.length === 1) {
        const parts = inputValue.trim().split(" ");
        parts[parts.length - 1] = completions[0];
        setInputValue(parts.join(" ") + " ");
      } else if (completions.length > 1) {
        setEntries(prev => [...prev, {
          command: inputValue,
          output: [{ segments: [{ text: completions.join("  "), explanation: "" }] }],
          simulated: true,
        }]);
      }
      return;
    }

    // arrow up/down for history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIdx);
      setInputValue(commandHistory[commandHistory.length - 1 - newIdx] || "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIdx);
      setInputValue(newIdx === -1 ? "" : commandHistory[commandHistory.length - 1 - newIdx] || "");
      return;
    }

    if (e.key !== "Enter" || !inputValue.trim()) return;

    const cmd = inputValue.trim();
    setInputValue("");
    setHistoryIndex(-1);
    setCommandHistory(prev => [...prev, cmd]);

    executeTerminalCommand(cmd);
  };

  const handleContainerClick = () => {
    if (!isProcessing && !disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div
        className={`terminal-container ${styles.terminalBlock} ${className || ""}`}
        onClick={handleContainerClick}
      >
        <div className={styles.terminalChrome}>
          <div className={styles.terminalDots}>
            <div className={styles.terminalDotRed}></div>
            <div className={styles.terminalDotYellow}></div>
            <div className={styles.terminalDotGreen}></div>
          </div>
          <span className={styles.terminalLabel}>{prompt}</span>
        </div>

        <div className={`terminal-history ${styles.terminalContentWrapper}`} ref={scrollContainerRef}>
          <div className={styles.terminalContent}>
            {allEntries.map((entry, entryIdx) => (
              <div key={entryIdx} className={styles.entryContainer}>
                <div className={styles.commandLine}>
                  <span className={styles.terminalPrompt}>{prompt} </span>
                  <span className={styles.terminalCommand}>{entry.command}</span>
                </div>

                {entry.output && entry.output.length > 0 && (
                  <div className={styles.outputContainer}>
                    {entry.output.map((line, lineIdx) => (
                      <div key={lineIdx} className={styles.outputLine}>
                        {line.segments.map((seg, segIdx) =>
                          entry.simulated ? (
                            <span
                              key={segIdx}
                              className={styles.outputSegment}
                            >
                              {renderColoredText(seg.text)}
                            </span>
                          ) : (
                            <Tooltip key={segIdx}>
                              <TooltipTrigger asChild>
                                <span className={styles.outputSegment}>{seg.text}</span>
                              </TooltipTrigger>
                              <TooltipContent
                                className={styles.segmentTooltip}
                                side="bottom"
                                sideOffset={8}
                              >
                                <div className={styles.segmentTooltipContent}>
                                  <code className={styles.segmentTooltipCode}>
                                    {seg.text.trim()}
                                  </code>
                                  <p className={styles.segmentTooltipExplanation}>
                                    {seg.explanation}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={`terminal-input-row ${styles.inputRow}`}>
          <span className={styles.terminalPrompt}>{prompt} </span>
          {isProcessing ? (
            <span className={styles.blinkingCursor}>&nbsp;</span>
          ) : (
            <input
              ref={inputRef}
              className={styles.terminalInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              spellCheck={false}
              autoComplete="off"
              placeholder={promptHint || ""}
            />
          )}
        </div>
      </div>

      {latestEntry && !latestEntry.simulated && latestEntry.breakdown && (
        <div style={{ marginTop: "var(--spacing-4)" }}>
          <CommandTranslationResult result={latestEntry.breakdown} />
        </div>
      )}

      {editorState && (
        <NanoEditor
          filename={editorState.filename}
          initialContent={editorState.content}
          onSave={(content) => {
            saveFileContent(editorState.absPath, content);
            setEntries(prev => [...prev, { 
              command: "nano " + editorState.filename, 
              output: [{ segments: [{ text: `Saved ${editorState.filename}`, explanation: "" }] }], 
              simulated: true 
            }]);
          }}
          onExit={() => setEditorState(null)}
        />
      )}
    </>
  );
};