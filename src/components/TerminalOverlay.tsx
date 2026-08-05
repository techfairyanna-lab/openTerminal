import React, { useState, useRef, useEffect } from 'react';
import { gameManager } from '../engine/GameManager';
import { executeCommand, getPrompt, getCompletions, saveFileContent } from '../engine/terminalSimulator';
import { soundManager } from '../audio/SoundManager';
import { Terminal, X, Monitor, Cpu, Sparkles } from 'lucide-react';
import styles from './TerminalOverlay.module.css';

interface TerminalEntry {
  command: string;
  output: string;
  isError?: boolean;
}

export const TerminalOverlay: React.FC = () => {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    {
      command: 'sys-init --backrooms',
      output: 'WELCOME TO TERMINAL ACADEMY - BACKROOMS SIMULATOR v2.4\nType "help" for available Linux commands or "pwd" to check current working directory.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState<'green' | 'amber' | 'cyan'>('green');
  const [nanoState, setNanoState] = useState<{ filename: string; absPath: string; content: string } | null>(null);
  const [nanoContent, setNanoContent] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prompt = getPrompt();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, nanoState]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [nanoState]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputValue.trim()) return;

      soundManager.playKeyClick();
      const cmd = inputValue;
      setInputValue('');
      setHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);

      // Execute in simulated Linux filesystem engine
      const res = executeCommand(cmd);

      if (res?.type === 'nano') {
        setNanoState({ filename: res.filename, absPath: res.absPath, content: res.content });
        setNanoContent(res.content);
        return;
      }

      if (res?.type === 'clear') {
        setEntries([]);
        return;
      }

      let outputText = (res && 'text' in res) ? res.text : '';
      let isErr = res?.type === 'error';

      // Evaluate command with game manager for puzzle progression
      const evalRes = gameManager.evaluateCommand(cmd);
      if (evalRes.success) {
        outputText += `\n\n${evalRes.message}`;
        soundManager.playSuccessFanfare();
      }

      setEntries((prev) => [
        ...prev,
        {
          command: cmd,
          output: outputText,
          isError: isErr,
        },
      ]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputValue(history[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex] || '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const comps = getCompletions(inputValue);
      if (comps.length === 1) {
        setInputValue(comps[0]);
      } else if (comps.length > 1) {
        setEntries((prev) => [
          ...prev,
          { command: inputValue, output: comps.join('  ') },
        ]);
      }
    }
  };

  const handleSaveNano = () => {
    if (nanoState) {
      saveFileContent(nanoState.absPath, nanoContent);
      setEntries((prev) => [
        ...prev,
        { command: `nano ${nanoState.filename}`, output: `[Wrote file ${nanoState.filename}]` },
      ]);
      setNanoState(null);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={() => gameManager.setTerminalOpen(false)}>
      <div 
        className={`${styles.terminalWindow} ${styles[theme]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.windowHeader}>
          <div className={styles.windowTitle}>
            <Terminal size={16} className={styles.iconTerminal} />
            <span>LINUX TERMINAL CONSOLE — {gameManager.getCurrentRoom().path}</span>
          </div>

          <div className={styles.themeControls}>
            <button 
              className={`${styles.themeBtn} ${theme === 'green' ? styles.active : ''}`}
              onClick={() => setTheme('green')}
              title="Green Phosphor CRT"
            >
              🟢 Green
            </button>
            <button 
              className={`${styles.themeBtn} ${theme === 'amber' ? styles.active : ''}`}
              onClick={() => setTheme('amber')}
              title="Amber Phosphor CRT"
            >
              🟠 Amber
            </button>
            <button 
              className={`${styles.themeBtn} ${theme === 'cyan' ? styles.active : ''}`}
              onClick={() => setTheme('cyan')}
              title="Cyber Cyan CRT"
            >
              🔵 Cyan
            </button>
            <button 
              className={styles.closeBtn}
              onClick={() => gameManager.setTerminalOpen(false)}
              title="Close Terminal (ESC)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CRT Scanline FX Filter Overlay */}
        <div className={styles.crtScanlines} />

        <div className={styles.terminalBody} ref={scrollRef}>
          {nanoState ? (
            <div className={styles.nanoContainer}>
              <div className={styles.nanoHeader}>
                GNU nano 7.2 — File: {nanoState.filename}
              </div>
              <textarea
                className={styles.nanoTextarea}
                value={nanoContent}
                onChange={(e) => setNanoContent(e.target.value)}
                autoFocus
              />
              <div className={styles.nanoFooter}>
                <button onClick={handleSaveNano} className={styles.nanoBtn}>Save (Ctrl+O)</button>
                <button onClick={() => setNanoState(null)} className={styles.nanoBtn}>Exit (Ctrl+X)</button>
              </div>
            </div>
          ) : (
            <>
              {entries.map((entry, idx) => (
                <div key={idx} className={styles.entryBlock}>
                  <div className={styles.commandPromptLine}>
                    <span className={styles.promptText}>{prompt}</span>
                    <span className={styles.commandText}>{entry.command}</span>
                  </div>
                  {entry.output && (
                    <pre className={`${styles.outputPre} ${entry.isError ? styles.errorOutput : ''}`}>
                      {entry.output}
                    </pre>
                  )}
                </div>
              ))}

              <div className={styles.inputLine}>
                <span className={styles.promptText}>{prompt}</span>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.termInput}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
